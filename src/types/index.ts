export * from "./errors";

export type Command = {
  name: string;
  description: string;
  handler: () => Promise<void> | void;
};

export type PackageManager = {
  name: string;
  installCommand: string;
  lockFile: string;
};

export type GitCleanOptions = {
  exclude?: string[];
  dryRun?: boolean;
};
