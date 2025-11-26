export class CliError extends Error {
  constructor(
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = "CliError";
  }
}

export class GitError extends CliError {
  constructor(message: string) {
    super(message, "GIT_ERROR");
    this.name = "GitError";
  }
}

export class FsError extends CliError {
  constructor(message: string) {
    super(message, "FS_ERROR");
    this.name = "FsError";
  }
}

export class PackageManagerError extends CliError {
  constructor(message: string) {
    super(message, "PACKAGE_MANAGER_ERROR");
    this.name = "PackageManagerError";
  }
}
