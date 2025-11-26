import { exec } from "node:child_process";
import { writeFile, unlink } from "node:fs/promises";
import { execPromise } from "../../core/utils";
import { checkGitRepository, handleError } from "../cli-utils";

const execPromiseWithOutput = (command: string): Promise<string> =>
  new Promise((resolve, reject) => {
    exec(command, (error, stdout) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });

export const handleAiCommit = async (): Promise<void> => {
  try {
    await checkGitRepository();
    await execPromise("git add .");
    const diff = await execPromiseWithOutput("git diff --cached");
    if (!diff.trim()) {
      console.log("No changes to commit.");
      return;
    }
    const diffFile = "/tmp/ai-commit-diff.txt";
    await writeFile(diffFile, diff);
    const message = await execPromiseWithOutput(
      `opencode run "Generate an optimized, concise commit message for these changes" -f "${diffFile}"`,
    );
    await unlink(diffFile);
    await execPromise(`git commit -m "${message.trim().replace(/"/g, '\\"')}"`);
    await execPromise("git push --force");
    console.log("AI commit and push completed.");
  } catch (error) {
    handleError(error);
  }
};
