import { removeEmptyDirectories } from "./core/fs";
import { gitClean } from "./core/git";
import { pnpmInstall } from "./core/package-manager";
import { getIgnorePatterns } from "./core/utils";

export const gitCleanCommand = async (): Promise<void> => {
  await Promise.all([removeEmptyDirectories("."), gitClean()]);
  await pnpmInstall();
};

export { default as prettierConfig } from "./config/prettier-config";
export { default as eslintConfig } from "./config/eslint-config";
export { getIgnorePatterns };
