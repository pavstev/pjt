import { execPromise, validateGitCleanOptions } from "./utils";
import { GitCleanOptions, GitError } from "../types";
import { logger } from "./logger";

export const gitClean = async (
  options: GitCleanOptions = {},
): Promise<void> => {
  validateGitCleanOptions(options);
  try {
    const { exclude = [".env.local"], dryRun = false } = options;
    const excludeArgs = exclude.map(e => `-e ${e}`).join(" ");
    const dryFlag = dryRun ? "--dry-run " : "";
    const command = `git clean -Xfd ${dryFlag}${excludeArgs}`;
    await execPromise(command);
    logger.info("Git clean completed successfully");
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Command execution failed")
    ) {
      throw new GitError("Git clean failed", { cause: error });
    }
    throw error;
  }
};
