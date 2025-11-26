import { removeEmptyDirectories } from "./fs.js";
import { gitClean } from "./git.js";
import { pnpmInstall } from "./package-manager.js";
import { getIgnorePatterns } from "./utils.js";

export const gitCleanCommand = async (): Promise<void> => {
  await Promise.all([removeEmptyDirectories("."), gitClean()]);
  await pnpmInstall();
};

export { default as prettierConfig } from "./prettier-config.js";
export { getIgnorePatterns };
