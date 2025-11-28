import { spawn } from "node:child_process";
import { CliError, CliErrorMessages } from "./types";
import { Logger } from "./logger";

export class CommandExecutor {
  constructor(private logger: Logger) {}

  /**
   * Executes an npm script asynchronously.
   * @param scriptName - The npm script name to run.
   * @returns A promise that resolves when the script completes successfully.
   * @throws CliError if the script execution fails.
   */
  public async exec(scriptName: string): Promise<void> {
    this.logger.info(`Running npm script: ${scriptName}`);
    return new Promise<void>((resolve, reject) => {
      const child = spawn("npm", ["run", scriptName], {
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
