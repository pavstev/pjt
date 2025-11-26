import type { CustomHasher, HasherContext, Task } from "@nx/devkit";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import type { RsbuildExecutorSchema } from "./schema";

export const rsbuildHasher: CustomHasher = async (
  task: Task,
  context: HasherContext,
) => {
  const options = task.overrides as RsbuildExecutorSchema;
  const { project: projectName } = context.taskGraph.tasks[task.id].target;
  const project = context.projectGraph.nodes[projectName];

  if (!project) {
    return { value: "no-project", details: { command: "", nodes: {} } };
  }

  const projectRoot = resolve(process.cwd(), project.data.root);
  const configPath = resolve(
    projectRoot,
    options.configPath || "rsbuild.config.ts",
  );

  // Create hash based on rsbuild config and key options
  let hashContent = "";

  // Include rsbuild config if it exists
  if (existsSync(configPath)) {
    try {
      const configContent = readFileSync(configPath, "utf-8");
      hashContent += configContent;
    } catch (_error) {
      console.warn(`Warning: Could not read rsbuild config at ${configPath}`);
    }
  }

  // Include key options that affect build output
  const relevantOptions = {
    mode: options.mode || "production",
    target: options.target || "web",
    environment: options.environment,
    outputPath: options.outputPath,
  };

  hashContent += JSON.stringify(
    relevantOptions,
    Object.keys(relevantOptions).sort(),
  );

  // Include package.json dependencies that might affect the build
  const packageJsonPath = resolve(projectRoot, "package.json");
  if (existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
      const deps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };
      // Only include build-related dependencies
      const buildDeps = Object.fromEntries(
        Object.entries(deps).filter(
          ([name]) =>
            name.includes("rsbuild") ||
            name.includes("rspack") ||
            name.includes("webpack") ||
            name.includes("@rsbuild"),
        ),
      );
      hashContent += JSON.stringify(buildDeps, Object.keys(buildDeps).sort());
    } catch (_error) {
      console.warn(
        `Warning: Could not read package.json at ${packageJsonPath}`,
      );
    }
  }

  // Create a simple hash (in production, you'd use a proper hashing function)
  const hash = Buffer.from(hashContent)
    .toString("base64")
    .replace(/[^a-z0-9]/gi, "")
    .substring(0, 16);

  return { value: hash, details: { command: "", nodes: {} } };
};

export default rsbuildHasher;
