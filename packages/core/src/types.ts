export * from "./errors";

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

export const objectEntries = Object.entries as <T>(
  obj: T,
) => [keyof T & string, T[keyof T]][];

export const objectFromEntries = Object.fromEntries as <T extends AnyObject>(
  entries: [keyof T, T[keyof T]][],
) => T;

export const objectFromArray = <K extends number | string | symbol, V>(
  arr: [K, ...K[]],
  resolveValue: (key: K) => V,
): Record<K, V> => {
  const result = {} as Record<K, V>;

  for (const key of arr) {
    result[key] = resolveValue(key);
  }

  return result;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyArray = any[];

export const ensureArray = <T>(arrayLike: T | T[]): T[] =>
  Array.isArray(arrayLike) ? arrayLike : [arrayLike];
