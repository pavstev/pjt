import { gitCleanCommand } from "../../index";
import { checkGitRepository } from "../cli-utils";

export const handleGitClean = async (): Promise<void> => {
  await checkGitRepository();
  await gitCleanCommand();
};
