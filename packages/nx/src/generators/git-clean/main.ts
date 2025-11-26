import type { Tree } from "@nx/devkit";

import { logger } from "@nx/devkit";
import { detectPackageManager } from "@pjt/core";
import { execSync } from "node:child_process";

import type { GitCleanGeneratorSchemaType } from "./schema";

export const generator = async (
  _tree: Tree,
  options: GitCleanGeneratorSchemaType,
): Promise<void> => {
  const { dir, hard } = options;

  try {
    const pm = await detectPackageManager(dir);
    if (!pm) {
      throw new Error("No package manager detected");
    }

    const cleanFlags = hard ? "-Xdf" : "-Xd";
    const cleanCmd = `git clean ${cleanFlags}`;

    logger.info("Git clean starting...");
    execSync(cleanCmd, { cwd: dir, stdio: "inherit" });
    logger.info("Git clean completed");

    const installCmd = `${pm.name} install`;
    logger.info("Reinstalling dependencies...");
    execSync(installCmd, { cwd: dir, stdio: "inherit" });
    logger.info("Dependencies reinstalled");
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};
