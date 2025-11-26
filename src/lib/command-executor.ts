import { execa } from "execa";
import { CliError, CliErrorMessages } from "./types";
import { Logger } from "./logger";

export class CommandExecutor {
  constructor(private logger: Logger) {}

  /**
   * Executes a shell command asynchronously.
   * @param command - The shell command to execute.
   * @returns A promise that resolves when the command completes successfully.
   * @throws CliError if the command execution fails.
   */
  public async exec(command: string): Promise<void> {
    this.logger.info(`Executing: ${command}`);
    try {
      const result = (await execa(command, { shell: true })) as {
        stdout: string;
      };
      if (result.stdout) this.logger.info(result.stdout.trim());
    } catch (error) {
      this.logger.error(`Command failed: ${command}`);
      if (error instanceof Error && "stderr" in error && error.stderr) {
        this.logger.error(error.stderr as string);
      }
      throw new CliError(
        CliErrorMessages.COMMAND_EXECUTION_FAILED_TEMPLATE.replace(
          "%s",
          command,
        ),
        {
          cause: error,
        },
      );
    }
  }
}
