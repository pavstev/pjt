import { promises as fs } from "node:fs";
import { CliError, GitError } from "../types";
import { logger } from "../core/logger";

export const checkGitRepository = async (): Promise<void> => {
  try {
    await fs.access(".git");
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      throw new GitError("Not a git repository");
    }
    throw new CliError("Failed to check git repository");
  }
};

export const handleError = (error: unknown): never => {
  if (error instanceof CliError) {
    logger.error(`${error.name}: ${error.message}`);
  } else if (error instanceof Error) {
    logger.error(`Error: ${error.message}`);
  } else {
    logger.error(`Error: ${String(error)}`);
  }
  process.exit(1);
};
