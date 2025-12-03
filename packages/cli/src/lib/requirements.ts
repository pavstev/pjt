import { execSync } from "node:child_process";

import { error } from "./logger";

/**
 * Check if a command is available
 * @param command - The command to check
 * @param errorMessage - Custom error message
 * @returns True if command is available
 */
export const requireCommand = (
  command: string,
  errorMessage?: string,
): boolean => {
  try {
    execSync(`which ${command}`, { stdio: "ignore" });
    return true;
  } catch {
    error(errorMessage ?? `Error: ${command} is not installed or not in PATH.`);
    return false;
  }
};

/**
 * Check if current directory is a git repository
 * @param errorMessage - Custom error message
 * @returns True if in a git repo
 */
export const requireGitRepo = (
  errorMessage = "fatal: not a git repository.",
): boolean => {
  try {
    execSync("git rev-parse --git-dir", {
      cwd: process.cwd(),
      stdio: "ignore",
    });
    return true;
  } catch {
    error(errorMessage);
    return false;
  }
};
