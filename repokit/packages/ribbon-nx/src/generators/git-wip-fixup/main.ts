import simpleGit from "simple-git";

import { createGitService, runFixupWorkflow } from "../../lib/git";
import { validate } from "../../lib/options";
import { GitWipFixupGeneratorSchemaZod } from "./schema";

export default validate(
  GitWipFixupGeneratorSchemaZod,
  async (_tree, options) => {
    const dryRun = options.dryRun ?? false;
    const limit = options.limit ?? 20;

    const gitService = createGitService(simpleGit());

    try {
      const hasWipCommits = await runFixupWorkflow(gitService, limit, dryRun);

      if (!hasWipCommits) {
        // No WIP commits found, nothing to do.
      }
    } catch (error) {
      throw new Error(
        `Git WIP Fixup failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },
);
