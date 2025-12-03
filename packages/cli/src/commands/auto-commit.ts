import { defineCommand } from "citty";

import { execCommand, execCommandOutput } from "../lib/command";
import { error, info, success } from "../lib/logger";
import { requireGitRepo } from "../lib/requirements";

export const command = defineCommand({
  args: {
    noVerify: {
      description: "Skip git hooks",
      type: "boolean",
    },
  },
  meta: {
    description: "Automatically commit and push all changes",
    name: "auto-commit",
  },
  run: async ({ args }) => {
    if (!requireGitRepo()) {
      throw new Error("Not a git repository");
    }

    const noVerifyArgs = args.noVerify ? ["--no-verify"] : [];

    info("[auto-commit] Adding all changes...");
    await execCommand("git", ["add", "--all"]);

    info("[auto-commit] Committing...");
    try {
      await execCommand("git", ["commit", "-m", "WIP", ...noVerifyArgs]);
      success("[auto-commit] Commit successful.");
    } catch {
      // Check if there's nothing to commit
      const status = await execCommandOutput("git", ["status", "--porcelain"]);
      if (status.trim() === "") {
        info("[auto-commit] Nothing to commit.");
      } else {
        error("[auto-commit] Error: git commit failed.");
        throw new Error("Git commit failed");
      }
    }

    info("[auto-commit] Pushing...");
    await execCommand("git", ["push", ...noVerifyArgs]);
    success("[auto-commit] Push successful.");
  },
});
