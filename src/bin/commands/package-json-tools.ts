import { gitCleanCommand } from "../../index.js";
import { checkGitRepository, handleError } from "../cli-utils.js";

export const handlePackageJsonTools = async (): Promise<void> => {
  try {
    await checkGitRepository();
    await gitCleanCommand();
  } catch (error) {
    handleError(error);
  }
};
