import { removeEmptyDirectories } from "./core/fs";
import { gitClean } from "./core/git";
import { pnpmInstall } from "./core/package-manager";
import { getIgnorePatterns, execPromise } from "./core/utils";
import { checkGitRepository, handleError } from "./bin/cli-utils";
import { logger } from "./core/logger";

export const gitCleanCommand = async (): Promise<void> => {
  try {
    await checkGitRepository();
    await Promise.all([removeEmptyDirectories("."), gitClean()]);
    await pnpmInstall();
  } catch (error) {
    handleError(error);
  }
};

export {
  removeEmptyDirectories,
  gitClean,
  pnpmInstall,
  getIgnorePatterns,
  execPromise,
  checkGitRepository,
  handleError,
  logger,
};

export * from "./types";

export { default as prettierConfig } from "./config/prettier-config";
export { default as eslintConfig } from "./config/eslint-config";
