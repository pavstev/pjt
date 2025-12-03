import { promises as fs } from "node:fs";

import type { CommandExecutor } from "./command-executor";
import type { Git } from "./git";
import type { Logger } from "./logger";
import type { ActionHandler, CommandDefinition, CommandOption } from "./types";

import { CliError, CliErrorMessages } from "./types";

export type CliUtils = {
  addCommandOptions(command: unknown, options: CommandOption[]): void;
  checkGitRepository(): Promise<void>;
  createCommandHandler(
    handler: ActionHandler,
  ): (options?: Record<string, unknown>) => Promise<void>;
  handleError(error: unknown): never;
  setupCommand(
    command: unknown,
    cmdDefinition: CommandDefinition,
    utils: CliUtils,
    git: Git,
    commandExecutor: CommandExecutor,
  ): void;
};

export const createCliUtils = (logger: Logger): CliUtils => {
  const addCommandOptions = (command: unknown, options: CommandOption[]) => {
    for (const opt of options) {
      const flag =
        opt.type === "boolean" ? `--${opt.name}` : `--${opt.name} <value>`;
      (command as { option: (flag: string, desc: string) => void }).option(
        flag,
        opt.description,
      );
    }
  };

  const checkGitRepository = async () => {
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
  };

  const handleError = (error: unknown) => {
    if (error instanceof CliError) {
      logger.error(`${error.name}: ${error.message}`);
      throw error;
    }

    if (error instanceof Error) {
      logger.error(`Error: ${error.message}`);
      throw error;
    }

    logger.error(`Error: ${String(error)}`);
    throw error;
  };

  const createCommandHandler = (handler: ActionHandler) => {
    return async (options?: Record<string, unknown>) => {
      try {
        await handler(options);
      } catch (error) {
        handleError(error);
      }
    };
  };

  const setupCommand = (
    command: unknown,
    cmdDefinition: CommandDefinition,
    utils: CliUtils,
    git: Git,
    commandExecutor: CommandExecutor,
  ) => {
    if (cmdDefinition.options) {
      addCommandOptions(command, cmdDefinition.options);
    }

    (command as { action: (fn: () => Promise<void>) => void }).action(
      createCommandHandler((options = {}) =>
        cmdDefinition.handler(utils, git, commandExecutor, options),
      ),
    );
  };

  return {
    addCommandOptions,
    checkGitRepository,
    createCommandHandler,
    handleError,
    setupCommand,
  };
};
