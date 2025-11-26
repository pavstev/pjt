import { exec } from "node:child_process";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { globifyGitIgnore } from "globify-gitignore";

export const execPromise = (command: string): Promise<void> =>
  new Promise((resolve, reject) => {
    exec(command, error => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });

export const getIgnorePatterns = async (): Promise<string[]> => {
  const directory = process.cwd();
  const entries = await Promise.all(
    readdirSync(".", {
      encoding: "utf8",
      recursive: false,
    })
      .filter((file: string) => /^\..(\w+)ignore$/.test(file))
      .map(async (file: string) => {
        const entries = await globifyGitIgnore(
          join(directory, file),
          directory,
          true,
        );

        return entries.filter(e => e.included).map(e => e.glob);
      }),
  );

  return entries.flat();
};
