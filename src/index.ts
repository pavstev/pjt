import { exec } from 'child_process';
import { promises as fs } from 'fs';
import { join } from 'path';

export async function removeEmptyDirectories(dir: string): Promise<void> {
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
}

export async function gitClean(exclude: string[] = ['.env.local']): Promise<void> {
  const excludeArgs = exclude.map(e => `-e ${e}`).join(' ');
  const command = `git clean -Xfd ${excludeArgs}`;
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

export async function pnpmInstall(): Promise<void> {
  return new Promise((resolve, reject) => {
    exec('pnpm i', (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

export async function gitCleanCommand(): Promise<void> {
  await removeEmptyDirectories('.');
  await gitClean();
  await pnpmInstall();
}