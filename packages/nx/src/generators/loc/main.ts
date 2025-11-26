import type { Tree } from "@nx/devkit";

import { logger } from "@nx/devkit";
import { execSync } from "node:child_process";

import type { LocGeneratorSchemaType } from "./schema";

export const generator = async (
  _tree: Tree,
  _options: LocGeneratorSchemaType,
): Promise<void> => {
  try {
    // Check if cloc is available
    try {
      execSync("which cloc", { stdio: "pipe" });
    } catch {
      throw new Error("cloc command not found. Please install cloc.");
    }

    logger.info("Counting lines of code...");
    execSync("cloc --vcs=git --quiet --exclude-lang=YAML,Markdown,JSON", {
      stdio: "inherit",
    });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};
