import { simpleGit } from "simple-git";
import { GitCleanOptions, CliError, CliErrorMessages } from "./types";
import { Logger } from "./logger";

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
