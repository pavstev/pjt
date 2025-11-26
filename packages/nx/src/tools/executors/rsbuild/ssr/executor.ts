import type { ExecutorContext } from "@nx/devkit";
import { createRsbuild } from "@rsbuild/core";
import path from "path";
import type { RsbuildSSRExecutorOptions } from "./schema";

const rsbuildSSRExecutor = async (
  options: RsbuildSSRExecutorOptions,
  context: ExecutorContext,
): Promise<{ success: boolean }> => {
  const { projectName } = context;
  if (!projectName) {
    throw new Error("Project name not found in context");
  }

  const projectRoot =
    context.projectsConfigurations.projects[projectName]?.root;

  if (!projectRoot) {
    throw new Error(`Project root not found for project: ${projectName}`);
  }

  const rsbuild = await createRsbuild({
    cwd: projectRoot,
    rsbuildConfig: (options.rsbuildConfig
      ? path.resolve(context.root, options.rsbuildConfig)
      : {
          mode: options.mode || "production",
        }) as Record<string, unknown>,
  });

  try {
    await rsbuild.build();

    return { success: true };
  } catch (error) {
    console.error("SSR build failed:", error);
    return { success: false };
  }
};

export default rsbuildSSRExecutor;
