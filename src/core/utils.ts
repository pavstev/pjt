import { exec } from "node:child_process";
import { readdirSync, promises as fs } from "node:fs";
import { join } from "node:path";
import { globifyGitIgnore } from "globify-gitignore";
import { CliError } from "../types";
import { logger } from "./logger";

export const validateDirectory = async (dir: string): Promise<void> => {
  if (!dir || typeof dir !== "string") {
    throw new CliError("Invalid directory path");
  }
  try {
    const stat = await fs.stat(dir);
    if (!stat.isDirectory()) {
      throw new CliError(`${dir} is not a directory`);
    }
  } catch (error) {
    if (error instanceof CliError) throw error;
    throw new CliError(`Directory ${dir} does not exist or is inaccessible`);
  }
};

export const validateGitCleanOptions = (options: unknown): void => {
  if (typeof options !== "object" || options === null) {
    throw new CliError("options must be an object");
  }
  const opts = options as Record<string, unknown>;
  if (opts.exclude !== undefined && !Array.isArray(opts.exclude)) {
    throw new CliError("exclude must be an array of strings");
  }
  if (opts.dryRun !== undefined && typeof opts.dryRun !== "boolean") {
    throw new CliError("dryRun must be a boolean");
  }
};

/**
 * Executes a shell command asynchronously.
 * @param command - The shell command to execute.
 * @returns A promise that resolves when the command completes successfully.
 * @throws CliError if the command execution fails.
 */
export const execPromise = (command: string): Promise<void> =>
  new Promise((resolve, reject) => {
    logger.info(`Executing: ${command}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        logger.error(`Command failed: ${command}`);
        if (stderr) logger.error(stderr);
        reject(
          new CliError(`Command execution failed: ${command}`, "EXEC_ERROR"),
        );
      } else {
        if (stdout) logger.info(stdout.trim());
        resolve();
      }
    });
  });

export const getIgnorePatterns = async (): Promise<string[]> => {
  try {
    const directory = process.cwd();
    const files = readdirSync(".", {
      encoding: "utf8",
      recursive: false,
    }).filter((file: string) => /^\..(\w+)ignore$/.test(file));

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
          logger.warn(`Failed to parse ignore file ${file}: ${error}`);
          return [];
        }
      }),
    );

    return entries.flat();
  } catch (error) {
    logger.error(`Failed to read ignore patterns: ${error}`);
    throw new CliError("Failed to read ignore patterns", "IGNORE_READ_ERROR");
  }
};
