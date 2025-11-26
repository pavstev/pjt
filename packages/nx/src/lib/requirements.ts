import { commandExists, isGitRepository } from "@pjt/core";

import { createLogger } from "./logger";

const logger = createLogger();

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
  if (commandExists(command)) {
    return true;
  }

  logger.error(
    errorMessage ?? `Error: ${command} is not installed or not in PATH.`,
  );
  return false;
};

/**
 * Check if current directory is a git repository
 * @param errorMessage - Custom error message
 * @returns True if in a git repo
 */
export const requireGitRepo = (
  errorMessage = "fatal: not a git repository.",
): boolean => {
  if (isGitRepository()) {
    return true;
  }

  logger.error(errorMessage);
  return false;
};
