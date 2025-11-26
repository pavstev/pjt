import { unlink, writeFile } from "node:fs/promises";
import { execa } from "execa";
import { execPromise } from "../../core/utils";
import { checkGitRepository } from "../cli-utils";

const execPromiseWithOutput = async (command: string): Promise<string> => {
  const result = await execa(command, { shell: true });
  return result.stdout;
};

export const handleAiCommit = async (): Promise<void> => {
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
};
