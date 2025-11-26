import { gitCleanCommand } from "../../index";
import { checkGitRepository, handleError } from "../cli-utils";

export const handlePackageJsonTools = async (): Promise<void> => {
  try {
    await checkGitRepository();
    await gitCleanCommand();
  } catch (error) {
    handleError(error);
  }
};
