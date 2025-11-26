import { spawn } from "node:child_process";
import { simpleGit } from "simple-git";

import type { Logger } from "./lib/logger";
import type { GitCleanOptions } from "./types";

export type Git = {
  gitInstance: ReturnType<typeof simpleGit>;
  clean: (options?: GitCleanOptions) => Promise<void>;
  isGitRepository: () => Promise<boolean>;
};

const validateGitCleanOptions = (options: unknown): void => {
  if (typeof options !== "object" || options === null) {
    throw new Error("options must be an object");
  }

  const opts = options as Record<string, unknown>;
  if (opts.exclude !== undefined && !Array.isArray(opts.exclude)) {
    throw new Error("exclude must be an array of strings");
  }
};

export const createGit = (logger: Logger): Git => {
  const git = simpleGit();

  return {
    gitInstance: git,

    clean: async (options: GitCleanOptions = {}): Promise<void> => {
      validateGitCleanOptions(options);
      try {
        const { exclude = [".env.local"] } = options;
        const args = ["clean"];
        args.push("-Xfd");
        for (const pattern of exclude) {
          args.push("-e", pattern);
        }
        await git.raw(args);
        logger.info("Git clean completed successfully");
      } catch (error) {
        if (error instanceof Error && error.name === "CliError") {
          throw error;
        }

        throw new Error("Git clean failed", {
          cause: error,
        });
      }
    },

    isGitRepository: async (): Promise<boolean> => {
      try {
        await git.revparse(["--git-dir"]);
        return true;
      } catch {
        return false;
      }
    },
  };
};

/**
 * Execute a git command and return stdout
 * @param args - Git command arguments
 * @returns Promise resolving to stdout string
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
 * @param patterns - Array of file patterns to check
 * @returns Promise resolving to true if any files are tracked
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
 * @returns Promise resolving to true if JSDoc comments are found
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

/**
 * Checks if a string is a valid GitHub URL.
 * @param urlString - The URL string to check.
 * @returns True if valid, false otherwise.
 */
export const isValidGithubUrl = (urlString: string): boolean => {
  const regex =
    /^https:\/\/github\.com\/[^/]+\/[^/]+\/(?:tree|blob)\/[^/]+(?:\/.+)?$/;
  return regex.test(urlString);
};

/**
 * Parses a GitHub path URL to extract repository details.
 * @param urlString - The full GitHub URL.
 * @returns Structured object containing repository components.
 */
export const parseGithubUrl = (
  urlString: string,
): import("./types").GitUrlData => {
  const regex =
    /^https:\/\/github\.com\/(?<owner>[^/]+)\/(?<repo>[^/]+)\/(?:tree|blob)\/(?<branch>[^/]+)(?:\/(?<path>.+))?$/;
  const match = urlString.match(regex);

  if (!match?.groups) {
    throw new Error(
      "Could not parse GitHub URL format. Expected: https://github.com/<owner>/<repo>/(tree|blob)/<branch>[/<path>]",
    );
  }

  const { branch, owner, path: folderPath, repo } = match.groups;
  const gitUrl = `https://github.com/${owner}/${repo}.git`;

  return { branch, folderPath: folderPath || ".", gitUrl, owner, repo };
};
