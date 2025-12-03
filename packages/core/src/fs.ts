import { globifyGitIgnore } from "globify-gitignore";
import { promises as fs, readdirSync } from "node:fs";
import { join } from "node:path";

import type { Logger } from "./logger";

import { CliError, CliErrorMessages } from "./types";

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
    throw new CliError(CliErrorMessages.FAILED_TO_READ_IGNORE_PATTERNS, {
      cause: error,
    });
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
    throw new CliError(
      CliErrorMessages.FAILED_TO_PROCESS_DIRECTORY_TEMPLATE.replace("%s", dir),
      { cause: error },
    );
  }
};

export const validateDirectory = async (dir: string): Promise<void> => {
  if (!dir || typeof dir !== "string") {
    throw new CliError(CliErrorMessages.INVALID_DIRECTORY_PATH);
  }

  try {
    const stat = await fs.stat(dir);
    if (!stat.isDirectory()) {
      throw new CliError(
        CliErrorMessages.NOT_A_DIRECTORY_TEMPLATE.replace("%s", dir),
      );
    }
  } catch (error) {
    if (error instanceof CliError) throw error;

    throw new CliError(
      CliErrorMessages.DIRECTORY_NOT_ACCESSIBLE_TEMPLATE.replace("%s", dir),
      {
        cause: error,
      },
    );
  }
};
