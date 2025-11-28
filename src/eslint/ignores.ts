import { FileSystem } from "../lib/fs";
import { logger } from "../lib/logger";

const fs = new FileSystem(logger);

export const getIgnores = async (): Promise<{ ignores: string[] }> => ({
  ignores: [
    "dist/",
    "node_modules/",
    "**/*.test.ts",
    ...(await fs.getIgnorePatterns()),
  ],
});
