import { execPromise } from "./utils";

export const pnpmInstall = async (): Promise<void> => execPromise("pnpm i");
