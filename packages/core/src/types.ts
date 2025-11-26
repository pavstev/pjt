export type ActionHandler = (
  options?: Record<string, unknown>,
) => Promise<void>;

export type AnyObject = Record<string, unknown>;

export type CommandDefinition = {
  description: string;
  handler: CommandHandler;
  isDefault?: boolean;
  name: string;
  options?: CommandOption[];
};

export type CommandHandler = (
  utils: import("./cli-utils").CliUtils,
  git: import("./git").Git,
  executor: import("./command-executor").CommandExecutor,
  options?: Record<string, unknown>,
) => Promise<void>;

export type CommandOption = {
  description: string;
  name: string;
  type?: "boolean" | "string";
};

export type ExportConfig = Record<
  string,
  null | string | undefined | { require?: null | string }
>;

export type FixMe = unknown;

export type GitCleanOptions = {
  exclude?: string[];
};

export type GitUrlData = {
  branch: string;
  folderPath: string;
  gitUrl: string;
  owner: string;
  repo: string;
};

export type InfiniteArray<T> = InfiniteArray<T>[] | T;

export type LogLevel = "debug" | "error" | "info" | "warn";

export type LogLevelPriorities = Record<LogLevel, number>;

// Logger type is now exported from lib/logger.ts

export type AnyArray = unknown[];

export const CliErrorMessages = {
  NOT_A_GIT_REPOSITORY: "Not a git repository",
  FAILED_TO_CHECK_GIT_REPOSITORY: "Failed to check git repository",
  COMMAND_EXECUTION_FAILED_TEMPLATE: "Command execution failed: %s",
} as const;
