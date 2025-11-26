export enum CliErrorMessages {
  INVALID_DIRECTORY_PATH = "Invalid directory path",
  DIRECTORY_NOT_ACCESSIBLE_TEMPLATE = "Directory %s does not exist or is inaccessible",
  NOT_A_DIRECTORY_TEMPLATE = "%s is not a directory",
  FAILED_TO_READ_IGNORE_PATTERNS = "Failed to read ignore patterns",
  FAILED_TO_CHECK_GIT_REPOSITORY = "Failed to check git repository",
  COMMAND_EXECUTION_FAILED_TEMPLATE = "Command execution failed: %s",
  NOT_A_GIT_REPOSITORY = "Not a git repository",
  GIT_CLEAN_FAILED = "Git clean failed",
  FAILED_TO_PROCESS_DIRECTORY_TEMPLATE = "Failed to process directory %s",
}

export class CliError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "CliError";
  }
}
