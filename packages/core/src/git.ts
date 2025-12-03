import { spawn } from "node:child_process";
import { simpleGit } from "simple-git";
import { Logger } from "./logger";
import { CliError, CliErrorMessages, GitCleanOptions } from "./types";

export class Git {
  private git = simpleGit();

  constructor(private logger: Logger) {}

  // Uses simple-git library instead of shell commands for better cross-platform support

  get gitInstance(): ReturnType<typeof simpleGit> {
    return this.git;
  }

  async isGitRepository(): Promise<boolean> {
    try {
      await this.git.revparse(["--git-dir"]);
      return true;
    } catch {
      return false;
    }
  }

  validateGitCleanOptions(options: unknown): void {
    if (typeof options !== "object" || options === null) {
      throw new CliError("options must be an object");
    }
    const opts = options as Record<string, unknown>;
    if (opts.exclude !== undefined && !Array.isArray(opts.exclude)) {
      throw new CliError("exclude must be an array of strings");
    }
    if (opts.dryRun !== undefined && typeof opts.dryRun !== "boolean") {
      throw new CliError("dryRun must be a boolean");
    }
  }

  async clean(options: GitCleanOptions = {}): Promise<void> {
    this.validateGitCleanOptions(options);
    try {
      const { exclude = [".env.local"], dryRun = false } = options;
      const args = ["clean"];
      if (dryRun) args.push("--dry-run");
      args.push("-Xfd");
      exclude.forEach(pattern => args.push("-e", pattern));
      await this.git.raw(args);
      this.logger.info("Git clean completed successfully");
    } catch (error) {
      if (error instanceof CliError) {
        throw error;
      }
      throw new CliError(CliErrorMessages.GIT_CLEAN_FAILED, { cause: error });
    }
  }
}

/**
 * Execute a git command and return stdout
 */
const executeGitCommand = async (args: string[]): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    const child = spawn("git", args, {
      stdio: ["inherit", "pipe", "inherit"],
    });

    let output = "";
    child.stdout.on("data", data => {
      output += data.toString();
    });

    child.on("close", code => {
      if (code === 0 || code === 1) {
        // grep returns 1 when no matches found
        resolve(output.trim());
      } else {
        reject(new Error(`git ${args[0]} failed with code ${code}`));
      }
    });

    child.on("error", reject);
  });

/**
 * Check if git tracks any files matching the given patterns
 */
export const checkGitTrackedFiles = async (
  patterns: string[],
): Promise<boolean> => {
  try {
    for (const pattern of patterns) {
      const result = await executeGitCommand(["ls-files", pattern]);
      if (result.length > 0) {
        return true;
      }
    }
    return false;
  } catch {
    // If git command fails, assume no tracked files
    return false;
  }
};

/**
 * Check if JSDoc comments exist in JS/TS files
 */
export const checkJSDocPresence = async (): Promise<boolean> => {
  try {
    const result = await executeGitCommand([
      "grep",
      "--cached",
      "--name-only",
      "-E",
      "\\*\\s+@[a-zA-Z]+",
      "--",
      "*.js",
      "*.ts",
      "*.tsx",
    ]);
    return result.length > 0;
  } catch {
    return false;
  }
};
