import { execPromise } from "../../utils.js";
import { checkGitRepository, handleError } from "../cli-utils.js";

export const handleAiCommit = async (): Promise<void> => {
  try {
    await checkGitRepository();
    await execPromise("git add .");
    await execPromise("oco --yes");
    await execPromise("git push --force");
    console.log("AI commit and push completed.");
  } catch (error) {
    handleError(error);
  }
};
