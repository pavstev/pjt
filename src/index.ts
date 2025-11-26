import { removeEmptyDirectories } from "./core/fs";
import { gitClean } from "./core/git";
import { pnpmInstall } from "./core/package-manager";
import { getIgnorePatterns, execPromise } from "./core/utils";
import { checkGitRepository, handleError } from "./bin/cli-utils";

export const gitCleanCommand = async (): Promise<void> => {
  await Promise.all([removeEmptyDirectories("."), gitClean()]);
  await pnpmInstall();
};

export {
  removeEmptyDirectories,
  gitClean,
  pnpmInstall,
  getIgnorePatterns,
  execPromise,
  checkGitRepository,
  handleError,
};

export { default as prettierConfig } from "./config/prettier-config";
export { default as eslintConfig } from "./config/eslint-config";
