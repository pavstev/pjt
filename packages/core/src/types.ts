export * from "./errors";
export { createCliError } from "./errors";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FixMe = any;

export type GitCleanOptions = {
  dryRun?: boolean;
  exclude?: string[];
};

export type InfiniteArray<T> = InfiniteArray<T>[] | T;

export type LogLevel = "debug" | "error" | "info" | "warn";

export type LogLevelPriorities = Record<LogLevel, number>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyArray = any[];
