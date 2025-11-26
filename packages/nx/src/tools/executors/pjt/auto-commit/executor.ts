import type { ExecutorContext } from "@nx/devkit";
import simpleGit from "simple-git";

export type AutoCommitExecutorSchema = {
  noVerify?: boolean;
};

const autoCommitExecutor = async (
  options: AutoCommitExecutorSchema,
  context: ExecutorContext,
): Promise<{ success: boolean }> => {
  const projectRoot =
    context.projectsConfigurations?.projects[context.projectName || ""]?.root ||
    ".";
  const git = simpleGit(projectRoot);

  try {
    console.log("[auto-commit] Adding all changes...");
    await git.add(["--all"]);

    console.log("[auto-commit] Committing...");
    try {
      const commitArgs = ["-m", "WIP"];
      if (options.noVerify) {
        commitArgs.push("--no-verify");
      }

      await git.commit(commitArgs);
      console.log("[auto-commit] Commit successful.");
    } catch {
      // Check if there's nothing to commit
      const status = await git.status();
      if (status.files.length === 0) {
        console.log("[auto-commit] Nothing to commit.");
      } else {
        console.error("[auto-commit] Error: git commit failed.");
        return { success: false };
      }
    }

    console.log("[auto-commit] Pushing...");
    const pushArgs = [];
    if (options.noVerify) {
      pushArgs.push("--no-verify");
    }

    await git.push("origin", "HEAD", pushArgs);
    console.log("[auto-commit] Push successful.");

    return { success: true };
  } catch (error) {
    console.error("Error during auto-commit:", error);
    return { success: false };
  }
};

export default autoCommitExecutor;
