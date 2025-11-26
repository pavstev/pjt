import { promises as fs } from "node:fs";
import { join } from "node:path";
import { FsError } from "../types";
import { logger } from "./logger";
import { validateDirectory } from "./utils";

export const removeEmptyDirectories = async (dir: string): Promise<void> => {
  await validateDirectory(dir);
  try {
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
      logger.info(`Removing empty directory: ${dir}`);
      await fs.rmdir(dir);
    }
  } catch (error) {
    logger.error(`Failed to remove empty directories in ${dir}: ${error}`);
    throw new FsError(`Failed to process directory ${dir}`);
  }
};
