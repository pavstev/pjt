import { execPromise } from "./utils";

export const gitClean = async (
  exclude: string[] = [".env.local"],
): Promise<void> => {
  const excludeArgs = exclude.map(e => `-e ${e}`).join(" ");
  const command = `git clean -Xfd ${excludeArgs}`;
  return execPromise(command);
};
