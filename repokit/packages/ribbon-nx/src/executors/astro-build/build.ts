import type { ExecutorContext, PromiseExecutor } from "@nx/devkit";

import { build } from "astro";

import type { BuildExecutorSchema } from "./schema";

const runExecutor: PromiseExecutor<BuildExecutorSchema> = async (
  _options,
  context: ExecutorContext,
) => {
  console.info(`Executing "astro build"...`);

  if (!context.projectName) {
    throw new Error("Project name not provided in context");
  }

  const projectConfig =
    context.projectsConfigurations.projects[context.projectName];
  if (!projectConfig) {
    throw new Error(`Project ${context.projectName} not found`);
  }

  const projectRoot = projectConfig.root;
  const root = `${context.cwd}/${projectRoot}`;

  try {
    await build({ root });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};

export default runExecutor;
