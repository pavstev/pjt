import { exec } from "child_process";
import { promises as fs } from "fs";
import { join } from "path";

const execPromise = (command: string): Promise<void> =>
  new Promise((resolve, reject) => {
    exec(command, error => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });

export const removeEmptyDirectories = async (dir: string): Promise<void> => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      await removeEmptyDirectories(fullPath);
    }
  }
  // After processing subdirs, check if current dir is empty
  const remaining = await fs.readdir(dir);
  if (remaining.length === 0) {
    await fs.rmdir(dir);
  }
};

export const gitClean = async (
  exclude: string[] = [".env.local"],
): Promise<void> => {
  const excludeArgs = exclude.map(e => `-e ${e}`).join(" ");
  const command = `git clean -Xfd ${excludeArgs}`;
  return execPromise(command);
};

export const pnpmInstall = async (): Promise<void> => execPromise("pnpm i");

export const gitCleanCommand = async (): Promise<void> => {
  await Promise.all([removeEmptyDirectories("."), gitClean()]);
  await pnpmInstall();
};
