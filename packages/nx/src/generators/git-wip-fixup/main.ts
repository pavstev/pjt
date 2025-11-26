import type { Tree } from "@nx/devkit";
import simpleGit from "simple-git";

import { createGitService, runFixupWorkflow } from "../../lib/git";

export default async (_tree: Tree, options: Record<string, unknown>) => {
  const limit = (options as { limit?: number }).limit ?? 20;

  const gitService = createGitService(simpleGit());

  try {
    const _hasWipCommits = await runFixupWorkflow(gitService, limit);

    return true;
  } catch (error) {
    throw new Error(
      `Git WIP Fixup failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};
