export class CliError extends Error {
  constructor(
    message: string,
    public code?: string,
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = "CliError";
  }
}

export class GitError extends CliError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, "GIT_ERROR", options);
    this.name = "GitError";
  }
}

export class FsError extends CliError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, "FS_ERROR", options);
    this.name = "FsError";
  }
}

export class PackageManagerError extends CliError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, "PACKAGE_MANAGER_ERROR", options);
    this.name = "PackageManagerError";
  }
}
