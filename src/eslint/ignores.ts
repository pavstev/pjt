import { FileSystem } from "../lib/fs";
import { logger } from "../lib/logger";

const fileSystem = new FileSystem(logger);

export const getIgnores = async () => ({
  ignores: [
    "dist/",
    "node_modules/",
    "**/*.test.ts",
    ...(await fileSystem.getIgnorePatterns()),
  ],
});
