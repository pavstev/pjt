import { spawn } from "node:child_process";
import { Logger } from "./logger";
import { CliError, CliErrorMessages } from "./types";

export class CommandExecutor {
  constructor(private logger: Logger) {}

  /**
   * Executes an arbitrary npm command asynchronously.
   * @param args - The npm command arguments.
   * @param captureOutput - Whether to capture stdout instead of inheriting stdio.
   * @returns A promise that resolves with the command output if captureOutput is true, otherwise void.
   * @throws CliError if the command execution fails.
   */
  public async execNpmCommand(
    args: string[],
    captureOutput = false,
  ): Promise<string | void> {
    const command = `npm ${args.join(" ")}`;
    this.logger.info(`Running npm command: ${command}`);
    return new Promise<string | void>((resolve, reject) => {
      const child = spawn("pnpm", args, {
        stdio: captureOutput ? ["inherit", "pipe", "inherit"] : "inherit",
        shell: true,
      });
      let stdout = "";
      if (captureOutput) {
        child.stdout?.on("data", data => {
          stdout += data.toString();
        });
      }
      child.on("close", (code: number | null) => {
        if (code === 0) {
          this.logger.info(`Command completed: ${command}`);
          resolve(captureOutput ? stdout : undefined);
        } else {
          this.logger.error(`Command failed: ${command}`);
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
    });
  }

  /**
   * Executes an npm script asynchronously.
   * @param scriptName - The npm script name to run.
   * @returns A promise that resolves when the script completes successfully.
   * @throws CliError if the script execution fails.
   */
  public async exec(scriptName: string): Promise<void> {
    this.logger.info(`Running npm script: ${scriptName}`);
    return new Promise<void>((resolve, reject) => {
      const child = spawn("pnpm", ["run", scriptName], {
        stdio: "inherit",
        shell: true,
      });
      child.on("close", (code: number | null) => {
        if (code === 0) {
          this.logger.info(`Script completed: ${scriptName}`);
          resolve();
        } else {
          this.logger.error(`Script failed: npm run ${scriptName}`);
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
    });
  }
}
