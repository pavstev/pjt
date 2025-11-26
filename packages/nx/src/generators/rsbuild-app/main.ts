import type { Tree } from "@nx/devkit";
import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  names,
  offsetFromRoot,
} from "@nx/devkit";
import { join } from "path";
import type { Schema } from "./schema";

const rsbuildAppGenerator = async (tree: Tree, options: Schema) => {
  const appDirectory = options.directory
    ? `${options.directory}/${options.name}`
    : options.name;
  const appProjectName = appDirectory.replace(/\//g, "-");
  const projectName = names(appProjectName).fileName;
  const projectRoot = `apps/${appDirectory}`;

  // Add project configuration
  addProjectConfiguration(tree, projectName, {
    root: projectRoot,
    projectType: "application",
    sourceRoot: `${projectRoot}/src`,
    targets: {
      build: {
        executor: "@pjt/rsbuild-plugin:rsbuild",
        options: {
          outputPath: `dist/${appDirectory}`,
          mode: "production",
        },
        configurations: {
          development: {
            mode: "development",
          },
          production: {
            mode: "production",
          },
        },
      },
      serve: {
        executor: "@pjt/rsbuild-plugin:rsbuild",
        options: {
          watch: true,
          mode: "development",
        },
      },
      preview: {
        executor: "@pjt/rsbuild-plugin:rsbuild",
        options: {
          mode: "production",
        },
        defaultConfiguration: "production",
      },
      ...(options.unitTestRunner !== "none" && {
        test: {
          executor: `@nx/${options.unitTestRunner}:${options.unitTestRunner}`,
          options: {
            jestConfig: `${projectRoot}/jest.config.ts`,
          },
        },
      }),
      ...(options.e2eTestRunner !== "none" && {
        e2e: {
          executor: `@nx/${options.e2eTestRunner}:${options.e2eTestRunner}`,
          options: {
            cypressConfig: `${projectRoot}-e2e/cypress.config.ts`,
            devServerTarget: `${projectName}:serve`,
            testingType: "e2e",
          },
        },
      }),
    },
    tags: options.tags ? options.tags.split(",").map(t => t.trim()) : [],
  });

  // Generate application files
  generateFiles(tree, join(__dirname, "files"), projectRoot, {
    ...options,
    ...names(options.name),
    projectName,
    projectRoot,
    offsetFromRoot: offsetFromRoot(projectRoot),
    template: "",
  });

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  console.log(`✅ Successfully generated Rsbuild application: ${projectName}`);
};

export default rsbuildAppGenerator;
