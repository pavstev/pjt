import { spawn } from "node:child_process";

import type { Logger } from "./logger";

import { CliError, CliErrorMessages } from "./types";

export type CommandExecutor = {
  exec(scriptName: string): Promise<void>;
  execNpmCommand(
    args: string[],
    captureOutput?: boolean,
  ): Promise<string | void>;
};

export const createCommandExecutor = (logger: Logger): CommandExecutor => ({
  /**
   * Executes an npm script asynchronously.
   * @param scriptName - The npm script name to run.
   * @returns A promise that resolves when the script completes successfully.
   * @throws {CliError} if the script execution fails.
   */
  exec: (scriptName: string): Promise<void> =>
    new Promise<void>((resolve, reject) => {
      logger.info(`Running npm script: ${scriptName}`);
      const child = spawn("pnpm", ["run", scriptName], {
        shell: true,
        stdio: "inherit",
      });
      child.on("close", (code: null | number) => {
        if (code === 0) {
          logger.info(`Script completed: ${scriptName}`);
          resolve();
        } else {
          logger.error(`Script failed: npm run ${scriptName}`);
          reject(
            new CliError(
              CliErrorMessages.COMMAND_EXECUTION_FAILED_TEMPLATE.replace(
                "%s",
                `npm run ${scriptName}`,
              ),
            ),
          );
        }
      });
      child.on("error", (err: unknown) => {
        reject(
          new CliError(
            CliErrorMessages.COMMAND_EXECUTION_FAILED_TEMPLATE.replace(
              "%s",
              `npm run ${scriptName}`,
            ),
            { cause: err },
          ),
        );
      });
    }),

  /**
   * Executes an arbitrary npm command asynchronously.
   * @param args - The npm command arguments.
   * @param captureOutput - Whether to capture stdout instead of inheriting stdio.
   * @returns A promise that resolves with the command output if captureOutput is true, otherwise void.
   * @throws {CliError} if the command execution fails.
   */
  execNpmCommand: (
    args: string[],
    captureOutput = false,
  ): Promise<string | void> =>
    new Promise<string | void>((resolve, reject) => {
      const command = `npm ${args.join(" ")}`;
      logger.info(`Running npm command: ${command}`);
      const child = spawn("pnpm", args, {
        shell: true,
        stdio: captureOutput ? ["inherit", "pipe", "inherit"] : "inherit",
      });
      let stdout = "";
      if (captureOutput) {
        child.stdout?.on("data", data => {
          stdout += data.toString();
        });
      }

      child.on("close", (code: null | number) => {
        if (code === 0) {
          logger.info(`Command completed: ${command}`);
          resolve(captureOutput ? stdout : undefined);
        } else {
          logger.error(`Command failed: ${command}`);
          reject(
            new CliError(
              CliErrorMessages.COMMAND_EXECUTION_FAILED_TEMPLATE.replace(
                "%s",
                command,
              ),
            ),
          );
        }
      });
      child.on("error", (err: unknown) => {
        reject(
          new CliError(
            CliErrorMessages.COMMAND_EXECUTION_FAILED_TEMPLATE.replace(
              "%s",
              command,
            ),
            { cause: err },
          ),
        );
      });
    }),
});
