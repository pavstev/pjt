import type { Options as ExecaOptions } from "execa";

import { execa } from "execa";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

import { createLogger } from "./logger";

const logger = createLogger();

/**
 * Create directory and change to it
 * @param directory - Directory name to create and enter
 */
export const createAndEnterDirectory = (directory: string): void => {
  if (!directory) {
    throw new Error("directory name is required");
  }

  const targetPath = resolve(process.cwd(), directory);
  mkdirSync(targetPath, { recursive: true });
  process.chdir(targetPath);
  console.log(`Created and changed to directory: ${targetPath}`);
};

/**
 * Execute a command with automatic error handling
 * @param command - The command to execute
 * @param args - Arguments for the command
 * @param options - Execa options
 * @param errorMessage - Custom error message (optional)
 */
export const execCommand = async (
  command: string,
  args: string[] = [],
  options: ExecaOptions = {},
  errorMessage?: string,
): Promise<void> => {
  try {
    await execa(command, args, { stdio: "inherit", ...options });
  } catch (err: unknown) {
    const errorMessageText = err instanceof Error ? err.message : String(err);
    logger.error(errorMessage ?? `Error: ${errorMessageText}`);
    throw err;
  }
};

/**
 * Execute a command and capture its output
 * @param command - The command to execute
 * @param args - Arguments for the command
 * @param options - Execa options
 * @param errorMessage - Custom error message (optional)
 * @returns The stdout output
 */
export const execCommandOutput = async (
  command: string,
  args: string[] = [],
  options: ExecaOptions = {},
  errorMessage?: string,
): Promise<string> => {
  try {
    const result = await execa(command, args, { stdio: "pipe", ...options });
    return typeof result.stdout === "string" ? result.stdout : "";
  } catch (err: unknown) {
    const errorMessageText = err instanceof Error ? err.message : String(err);
    logger.error(errorMessage ?? `Error: ${errorMessageText}`);
    throw err;
  }
};

/**
 * Execute a command and return its result without exiting on error
 * @param command - The command to execute
 * @param args - Arguments for the command
 * @param options - Execa options
 * @returns The result or null if failed
 */
export const execCommandSafe = async (
  command: string,
  args: string[] = [],
  options: ExecaOptions = {},
): Promise<unknown> => {
  try {
    return await execa(command, args, options);
  } catch {
    return null;
  }
};

/**
 * Handle errors in command actions
 * @param action - The async action to execute
 * @param errorMessage - Custom error message (optional)
 */
export const handleCommandError = async (
  action: () => Promise<void>,
  errorMessage?: string,
): Promise<void> => {
  try {
    await action();
  } catch (err: unknown) {
    const errorMessageText = err instanceof Error ? err.message : String(err);
    logger.error(errorMessage ?? `Error: ${errorMessageText}`);
    throw err;
  }
};
