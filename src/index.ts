import { removeEmptyDirectories } from "./fs.js";
import { gitClean } from "./git.js";
import { pnpmInstall } from "./package-manager.js";

export const gitCleanCommand = async (): Promise<void> => {
  await Promise.all([removeEmptyDirectories("."), gitClean()]);
  await pnpmInstall();
};
