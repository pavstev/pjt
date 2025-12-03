import { promises as fs } from "node:fs";
import { CommandExecutor } from "./command-executor";
import { Git } from "./git";
import { Logger } from "./logger";
import {
  ActionHandler,
  CliError,
  CliErrorMessages,
  CommandDefinition,
  CommandOption,
} from "./types";

export class CliUtils {
  constructor(private logger: Logger) {}

  public async checkGitRepository(): Promise<void> {
    try {
      await fs.access(".git");
    } catch (error) {
      if (
        error instanceof Error &&
        "code" in error &&
        error.code === "ENOENT"
      ) {
        throw new CliError(CliErrorMessages.NOT_A_GIT_REPOSITORY, {
          cause: error,
        });
      }
      throw new CliError(CliErrorMessages.FAILED_TO_CHECK_GIT_REPOSITORY, {
        cause: error,
      });
    }
  }

  public handleError(error: unknown): never {
    if (error instanceof CliError) {
      this.logger.error(`${error.name}: ${error.message}`);
      process.exit(1);
    }
    if (error instanceof Error) {
      this.logger.error(`Error: ${error.message}`);
      process.exit(1);
    }
    this.logger.error(`Error: ${String(error)}`);
    process.exit(1);
  }

  public createCommandHandler(
    handler: ActionHandler,
  ): (options?: Record<string, unknown>) => Promise<void> {
    return async (options?: Record<string, unknown>) => {
      try {
        await handler(options);
      } catch (error) {
        this.handleError(error);
      }
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public addCommandOptions(command: any, options: CommandOption[]): void {
    options.forEach(opt => {
      const flag =
        opt.type === "boolean" ? `--${opt.name}` : `--${opt.name} <value>`;
      command.option(flag, opt.description);
    });
  }

  public setupCommand(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    command: any,
    cmdDefinition: CommandDefinition,
    utils: CliUtils,
    git: Git,
    commandExecutor: CommandExecutor,
  ): void {
    if (cmdDefinition.options) {
      this.addCommandOptions(command, cmdDefinition.options);
    }
    command.action(
      this.createCommandHandler((options = {}) =>
        cmdDefinition.handler(utils, git, commandExecutor, options),
      ),
    );
  }
}
