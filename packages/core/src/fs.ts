import { globifyGitIgnore } from "globify-gitignore";
import { promises as fs, readdirSync } from "node:fs";
import { access, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import type { Logger } from "./lib/logger";

export const getIgnorePatterns = async (logger: Logger): Promise<string[]> => {
  try {
    const directory = process.cwd();
    const files = readdirSync(".", {
      encoding: "utf8",
      recursive: false,
    }).filter((file: string) => /^\..*\wignore$/.test(file));

    const entries = await Promise.all(
      files.map(async (file: string) => {
        try {
          const entries = await globifyGitIgnore(
            join(directory, file),
            directory,
            true,
          );
          return entries.filter(e => e.included).map(e => e.glob);
        } catch (error) {
          logger.warn(
            `Failed to parse ignore file ${file}: ${error instanceof Error ? error.message : String(error)}`,
          );
          return [];
        }
      }),
    );

    return entries.flat();
  } catch (error) {
    logger.error(
      `Failed to read ignore patterns: ${error instanceof Error ? error.message : String(error)}`,
    );
    throw new Error(
      `Failed to read ignore patterns: ${error instanceof Error ? error.message : String(error)}`,
      {
        cause: error,
      },
    );
  }
};

export const removeEmptyDirectories = async (
  dir: string,
  logger: Logger,
): Promise<void> => {
  await validateDirectory(dir);
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (!entry.isDirectory()) continue;

      await removeEmptyDirectories(fullPath, logger);
    }
    // After processing subdirs, check if current dir is empty
    const remaining = await fs.readdir(dir);
    if (remaining.length === 0) {
      logger.info(`Removing empty directory: ${dir}`);
      await fs.rmdir(dir);
    }
  } catch (error) {
    logger.error(
      `Failed to remove empty directories in ${dir}: ${error instanceof Error ? error.message : String(error)}`,
    );
    throw new Error(`Failed to process directory: ${dir}`, { cause: error });
  }
};

export const validateDirectory = async (dir: string): Promise<void> => {
  if (!dir || typeof dir !== "string") {
    throw new Error("Invalid directory path");
  }

  try {
    const stat = await fs.stat(dir);
    if (!stat.isDirectory()) {
      throw new Error(`Not a directory: ${dir}`);
    }
  } catch (error) {
    if (error instanceof Error && error.name === "CliError") throw error;

    throw new Error(`Directory not accessible: ${dir}`, {
      cause: error,
    });
  }
};

/**
 * Checks if a path exists.
 * @param path - The path to check.
 * @returns True if the path exists, false otherwise.
 */
export const pathExists = async (path: string): Promise<boolean> =>
  access(path).then(
    () => true,
    () => false,
  );

/**
 * Creates a temporary directory with a prefix.
 * @param prefix - The prefix for the temp directory.
 * @returns The path to the created temp directory.
 */
export const createTempDir = async (prefix: string): Promise<string> =>
  mkdtemp(join(tmpdir(), prefix));
