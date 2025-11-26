import { execPromise } from "./utils";
import { PackageManagerError } from "../types";
import { logger } from "./logger";

export const pnpmInstall = async (): Promise<void> => {
  try {
    await execPromise("pnpm i");
    logger.info("Package installation completed");
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Command execution failed")
    ) {
      throw new PackageManagerError(PackageManagerError.packageInstallationFailed(), { cause: error });
    }
    throw error;
  }
};
