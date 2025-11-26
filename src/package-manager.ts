import { execPromise } from "./utils.js";

export const pnpmInstall = async (): Promise<void> => execPromise("pnpm i");
