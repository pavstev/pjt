export * from "./errors";

export type GitCleanOptions = {
  exclude?: string[];
  dryRun?: boolean;
};

export type LogLevel = "debug" | "info" | "warn" | "error";
