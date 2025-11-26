import { promises as fs } from "node:fs";
import { CliError, CliErrorMessages } from "./types";
import { Logger } from "./logger";

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

  public createCommandHandler(handler: () => Promise<void>) {
    return async () => {
      try {
        await handler();
      } catch (error) {
        this.handleError(error);
      }
    };
  }
}
