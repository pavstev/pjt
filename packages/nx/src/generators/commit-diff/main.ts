import type { Tree } from "@nx/devkit";

import { execSync } from "node:child_process";

import type { CommitDiffGeneratorSchemaType } from "./schema";

export const generator = async (
  _tree: Tree,
  _options: CommitDiffGeneratorSchemaType,
): Promise<void> => {
  try {
    const output = execSync(
      "git rev-list --left-right --count HEAD...origin/main",
      { encoding: "utf-8", stdio: "pipe" },
    );
    const [ahead, behind] = output.trim().split("\t").map(Number);
    console.log(`Behind: ${behind} | Ahead: ${ahead}`);
    console.log("------------------------------");

    execSync("git --no-pager diff --stat HEAD...origin/main", {
      stdio: "inherit",
    });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};
