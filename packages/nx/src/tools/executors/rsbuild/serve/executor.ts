import type { ExecutorContext } from "@nx/devkit";
import { createRsbuild } from "@rsbuild/core";

type RsbuildServeExecutorOptions = {
  outputPath?: string;
  mode?: "development" | "production";
  rsbuildConfig?: string;
};

const rsbuildServeExecutor = async (
  options: RsbuildServeExecutorOptions,
  context: ExecutorContext,
): Promise<{ success: boolean }> => {
  const projectRoot =
    context.projectsConfigurations?.projects[context.projectName || ""]?.root;

  if (!projectRoot) {
    throw new Error(
      `Project root not found for project: ${context.projectName}`,
    );
  }

  const rsbuild = await createRsbuild({
    cwd: projectRoot,
  });

  try {
    await rsbuild.startDevServer();
    // Keep the server running
    return new Promise(() => {
      // Never resolve to keep the server running
    });
  } catch (error) {
    console.error("Serve failed:", error);
    return { success: false };
  }
};

export default rsbuildServeExecutor;
