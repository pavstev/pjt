import type { ExecutorContext, PromiseExecutor } from "@nx/devkit";

import { exec } from "child_process";
import { promisify } from "util";

import type { OxlintExecutorSchema } from "./schema";

const execAsync = promisify(exec);

/**
 * @param pattern - The pattern string with placeholders
 * @param values - The values to replace placeholders
 * @returns The interpolated string
 */
const interpolate = (
  pattern: string,
  values: Record<string, string>,
): string => {
  return pattern.replace(
    /\{(\w+)\}/g,
    (match, key) => values[key as keyof typeof values] || match,
  );
};

const buildArgs = (
  options: OxlintExecutorSchema,
  normalizedLintFilePatterns: string[],
): string[] => {
  const args = [];

  if (options.fix) {
    args.push("--fix");
  }

  if (options.format && options.format !== "default") {
    args.push("--format", options.format);
  }

  if (options.quiet) {
    args.push("--quiet");
  }

  // Add max warnings if specified
  if (options.maxWarnings !== undefined && options.maxWarnings >= 0) {
    args.push("--max-warnings", options.maxWarnings.toString());
  }

  // Add file patterns
  args.push(...normalizedLintFilePatterns);

  return args;
};

const getNormalizedLintFilePatterns = (
  options: OxlintExecutorSchema,
  context: ExecutorContext,
  projectRoot: string,
): string[] => {
  return (options.lintFilePatterns || ["**/*.{js,jsx,ts,tsx}"]).map(
    (pattern: string) => {
      return interpolate(pattern, {
        projectName: context.projectName || "",
        projectRoot,
        workspaceRoot: "",
      });
    },
  );
};

const runExecutor: PromiseExecutor<OxlintExecutorSchema> = async (
  options,
  context: ExecutorContext,
) => {
  console.info(`Executing "oxlint"...`);

  if (!context.projectName) {
    throw new Error("Project name not provided in context");
  }

  const projectConfig =
    context.projectsConfigurations.projects[context.projectName];
  if (!projectConfig) {
    throw new Error(`Project ${context.projectName} not found`);
  }

  const projectRoot = projectConfig.root;

  const normalizedLintFilePatterns = getNormalizedLintFilePatterns(
    options,
    context,
    projectRoot,
  );

  const args = buildArgs(options, normalizedLintFilePatterns);

  const oxlintBin = require.resolve("oxlint/bin/oxlint");
  const command = `${oxlintBin} ${args.join(" ")}`;

  try {
    const { stderr, stdout } = await execAsync(command, { cwd: context.cwd });
    if (stdout) console.log(stdout);

    if (stderr) console.error(stderr);

    return { success: true };
  } catch (error) {
    console.error(`Error running oxlint: ${String(error)}`);
    return { success: false };
  }
};

export default runExecutor;
