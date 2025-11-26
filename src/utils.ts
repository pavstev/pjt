import { exec } from "node:child_process";

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
