export enum CliErrorMessages {
  FAILED_TO_CHECK_GIT_REPOSITORY = "Failed to check git repository",
  COMMAND_EXECUTION_FAILED_TEMPLATE = "Command execution failed: %s",
  NOT_A_GIT_REPOSITORY = "Not a git repository",
  GIT_CLEAN_FAILED = "Git clean failed",
}

export class CliError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "CliError";
  }
}
