export * from "./errors";

export type GitCleanOptions = {
  exclude?: string[];
  dryRun?: boolean;
};

export type LogLevel = "debug" | "info" | "warn" | "error";

type CommandOption = {
  name: string;
  description: string;
  type?: "boolean" | "string";
};

export type CommandHandler = (
  utils: import("./cli-utils").CliUtils,
  git: import("./git").Git,
  executor: import("./command-executor").CommandExecutor,
  options?: Record<string, unknown>,
) => Promise<void>;

export type ActionHandler = (
  options?: Record<string, unknown>,
) => Promise<void>;

export type CommandDefinition = {
  name: string;
  description: string;
  handler: CommandHandler;
  isDefault?: boolean;
  options?: CommandOption[];
};

export type LogLevelPriorities = Record<LogLevel, number>;

export type ExportConfig = Record<string, string | { require?: string }>;
