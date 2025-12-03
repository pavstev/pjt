import type { ExecutorContext, PromiseExecutor } from "@nx/devkit";

import { check } from "@astrojs/check";

import type { AstroCheckExecutorSchema } from "./schema";

const runExecutor: PromiseExecutor<AstroCheckExecutorSchema> = async (
  _options,
  context: ExecutorContext,
) => {
  console.info(`Executing "astro check"...`);

  if (!context.projectName) {
    throw new Error("Project name not provided in context");
  }

  const projectConfig =
    context.projectsConfigurations.projects[context.projectName];
  if (!projectConfig) {
    throw new Error(`Project ${context.projectName} not found`);
  }

  const projectRoot = projectConfig.root;

  return {
    success: (await check({ root: projectRoot })) !== false,
  };
};

export default runExecutor;
