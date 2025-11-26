import type { ExecutorContext, PromiseExecutor } from "@nx/devkit";
import { workspaceRoot } from "@nx/devkit";
import { execSync } from "child_process";
import { existsSync } from "fs";
import { resolve } from "path";
import type { RsbuildExecutorSchema } from "./schema";

const runExecutor: PromiseExecutor<RsbuildExecutorSchema> = async (
  options,
  context: ExecutorContext,
) => {
  const projectName = context.projectName;
  if (!projectName) {
    throw new Error("Project name not found in context");
  }

  const project = context.projectGraph.nodes[projectName]?.data;
  if (!project) {
    throw new Error(`Project ${projectName} not found`);
  }

  const { root: projectRoot, sourceRoot } = project;

  console.log(`🚀 Building ${projectName} with Rsbuild...`);

  // Validate project configuration
  if (!projectRoot) {
    throw new Error(`Project root not found for ${projectName}`);
  }

  const projectPath = resolve(workspaceRoot, projectRoot);
  const configPath = resolve(
    projectPath,
    options.configPath || "rsbuild.config.ts",
  );

  // Check if rsbuild config exists
  if (!existsSync(configPath)) {
    console.warn(`⚠️  Rsbuild config not found at ${configPath}`);
    console.log("💡 Creating default rsbuild configuration...");

    // Create a basic rsbuild config if it doesn't exist
    const defaultConfig = generateDefaultConfig(sourceRoot, options);
    await createDefaultConfigFile(configPath, defaultConfig);
  }

  // Build rsbuild command
  const command = buildRsbuildCommand(options, projectPath);

  try {
    console.log(`📦 Running: ${command}`);

    // Execute rsbuild command
    execSync(command, {
      cwd: projectPath,
      stdio: "inherit",
      env: {
        ...process.env,
        NODE_ENV: options.mode || "production",
        ...(options.analyze && { ANALYZE: "true" }),
        ...(options.profile && { PROFILE: "true" }),
      },
    });

    console.log(`✅ Successfully built ${projectName}`);

    return {
      success: true,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ Failed to build ${projectName}:`, message);
    return {
      success: false,
      error: message,
    };
  }
};

const buildRsbuildCommand = (
  options: RsbuildExecutorSchema,
  projectPath: string,
): string => {
  const commandParts = ["npx rsbuild build"];

  // Add mode
  if (options.mode) {
    commandParts.push(`--mode ${options.mode}`);
  }

  // Add watch mode
  if (options.watch) {
    commandParts.push("--watch");
  }

  // Add config path if custom
  if (options.configPath && options.configPath !== "rsbuild.config.ts") {
    commandParts.push(`--config ${options.configPath}`);
  }

  // Add environment
  if (options.environment) {
    commandParts.push(`--env ${options.environment}`);
  }

  // Add target
  if (options.target && options.target !== "web") {
    commandParts.push(`--target ${options.target}`);
  }

  // Add output path
  if (options.outputPath) {
    const resolvedOutputPath = options.outputPath.replace(
      "{projectRoot}",
      projectPath,
    );
    commandParts.push(`--output ${resolvedOutputPath}`);
  }

  return commandParts.join(" ");
};

const generateDefaultConfig = (
  sourceRoot: string | undefined,
  options: RsbuildExecutorSchema,
): string => {
  const entryPoint = sourceRoot ? `${sourceRoot}/index.ts` : "./src/index.ts";

  return `
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      index: '${entryPoint}',
    },
  },
  output: {
    distPath: {
      root: 'dist',
    },
  },
  tools: {
    rspack: {
      mode: '${options.mode || "production"}',
      target: '${options.target || "web"}',
    },
  },
  ${
    options.analyze
      ? `
  performance: {
    buildAnalyze: {
      analyzerMode: 'static',
      openAnalyzer: false,
    },
  },`
      : ""
  }
});
`;
};

const createDefaultConfigFile = async (
  configPath: string,
  content: string,
): Promise<void> => {
  try {
    execSync(`mkdir -p $(dirname "${configPath}")`, { stdio: "inherit" });
    execSync(
      `cat > "${configPath}" << 'EOF'
${content}
EOF`,
      { stdio: "inherit" },
    );
    console.log(`✅ Created default rsbuild config at ${configPath}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ Failed to create config file: ${message}`);
  }
};

export default runExecutor;
