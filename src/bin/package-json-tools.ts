import { gitCleanCommand } from "../index.js";

export const packageJsonTools = async (): Promise<void> => {
  await gitCleanCommand();
};
