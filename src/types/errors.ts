export class CliError extends Error {
  constructor(
    message: string,
    public code?: string,
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = "CliError";
  }

  static invalidDirectoryPath() {
    return "Invalid directory path";
  }

  static directoryNotAccessible(dir: string) {
    return `Directory ${dir} does not exist or is inaccessible`;
  }

  static notADirectory(dir: string) {
    return `${dir} is not a directory`;
  }

  static failedToReadIgnorePatterns() {
    return "Failed to read ignore patterns";
  }

  static failedToCheckGitRepository() {
    return "Failed to check git repository";
  }

  static commandExecutionFailed(command: string) {
    return `Command execution failed: ${command}`;
  }
}

export class GitError extends CliError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, "GIT_ERROR", options);
    this.name = "GitError";
  }

  static notAGitRepository() {
    return "Not a git repository";
  }

  static gitCleanFailed() {
    return "Git clean failed";
  }
}

export class FsError extends CliError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, "FS_ERROR", options);
    this.name = "FsError";
  }

  static failedToProcessDirectory(dir: string) {
    return `Failed to process directory ${dir}`;
  }
}

export class PackageManagerError extends CliError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, "PACKAGE_MANAGER_ERROR", options);
    this.name = "PackageManagerError";
  }

  static packageInstallationFailed() {
    return "Package installation failed";
  }
}
