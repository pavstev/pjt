export enum CliErrorMessages {
  COMMAND_EXECUTION_FAILED_TEMPLATE = "Command execution failed: %s",
  DIRECTORY_NOT_ACCESSIBLE_TEMPLATE = "Directory not accessible: %s",
  FAILED_TO_CHECK_GIT_REPOSITORY = "Failed to check git repository",
  FAILED_TO_PROCESS_DIRECTORY_TEMPLATE = "Failed to process directory: %s",
  FAILED_TO_READ_IGNORE_PATTERNS = "Failed to read ignore patterns",
  GIT_CLEAN_FAILED = "Git clean failed",
  INVALID_DIRECTORY_PATH = "Invalid directory path",
  NOT_A_DIRECTORY_TEMPLATE = "Not a directory: %s",
  NOT_A_GIT_REPOSITORY = "Not a git repository",
}

export class CliError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "CliError";
  }
}
