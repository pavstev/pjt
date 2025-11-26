import type { Tree } from "@nx/devkit";

import { logger } from "@nx/devkit";
import { execSync } from "node:child_process";

import type { AutoCommitGeneratorSchemaType } from "./schema";

export const generator = async (
  _tree: Tree,
  options: AutoCommitGeneratorSchemaType,
): Promise<void> => {
  const { noVerify } = options;

  try {
    // Check if we're in a git repository
    try {
      execSync("git rev-parse --git-dir", { stdio: "pipe" });
    } catch {
      throw new Error("Not a git repository");
    }

    const noVerifyArgs = noVerify ? ["--no-verify"] : [];

    logger.info("Adding all changes...");
    execSync("git add --all", { stdio: "inherit" });

    logger.info("Committing...");
    try {
      execSync(`git commit -m "WIP" ${noVerifyArgs.join(" ")}`, {
        stdio: "inherit",
      });
      logger.info("Commit successful.");
    } catch {
      // Check if there's nothing to commit
      const status = execSync("git status --porcelain", {
        encoding: "utf-8",
        stdio: "pipe",
      });
      if (status.trim() === "") {
        logger.info("Nothing to commit.");
      } else {
        throw new Error("Git commit failed");
      }
    }

    logger.info("Pushing...");
    execSync(`git push ${noVerifyArgs.join(" ")}`, { stdio: "inherit" });
    logger.info("Push successful.");
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};
