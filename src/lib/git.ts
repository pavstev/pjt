import { CommandExecutor } from "./command-executor";
import { GitCleanOptions, CliError, CliErrorMessages } from "./types";
import { Logger } from "./logger";

export class Git {
  constructor(
    private commandExecutor: CommandExecutor,
    private logger: Logger,
  ) {}

  validateGitCleanOptions(options: unknown): void {
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
  }

  async clean(options: GitCleanOptions = {}): Promise<void> {
    this.validateGitCleanOptions(options);
    try {
      const { exclude = [".env.local"], dryRun = false } = options;
      const excludeArgs = exclude.map(e => `-e ${e}`).join(" ");
      const dryFlag = dryRun ? "--dry-run " : "";
      const command = `git clean -Xfd ${dryFlag}${excludeArgs}`;
      await this.commandExecutor.exec(command);
      this.logger.info("Git clean completed successfully");
    } catch (error) {
      if (error instanceof CliError) {
        throw error;
      }
      throw new CliError(CliErrorMessages.GIT_CLEAN_FAILED, { cause: error });
    }
  }
}
