import { createProjectGraphAsync, type ProjectConfiguration } from "@nx/devkit";
import { defineCommand } from "citty";
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import standardVersion from "standard-version";

export type ReleaseProjectOptions = {
  dryRun: boolean;
  version: string | undefined;
};

const NX_BUILD_COMMAND = "npx nx build";
const NPM_PUBLISH_COMMAND = "npm publish";
const PACKAGE_JSON = "package.json";

/**
 * Release a project
 * @param projectName - The name of the project to release
 * @param options - Release options
 */
export const releaseProject = async (
  projectName: string,
  options: ReleaseProjectOptions & { localRelease: boolean },
): Promise<void> => {
  const projectGraph = await createProjectGraphAsync();

  const project = projectGraph.nodes[projectName].data as ProjectConfiguration;
  const { ...rest } = options;

  if (options.localRelease) {
    await releaseLocally(projectName, project, {
      ...rest,
      version: options.version ?? "99.99.99",
    });
  } else {
    await releaseToNpm(projectName, project, rest);
  }

  if (options.dryRun) {
    console.log(
      `\n[DRY RUN]: No changes were made to the project "${projectName}".\n`,
    );
  }
};

/**
 * Assert that the NPM registry is set to a local registry
 */
const assertLocalRegistry = (): void => {
  const registry = execSync("npm config get registry", { encoding: "utf8" });

  if (!registry.trim().startsWith("http://localhost")) {
    throw new Error(
      `The NPM registry must be set to a local registry. Current value: ${registry}`,
    );
  }
};

/**
 * Execute a command or log it if dry run
 * @param command - The command to execute
 * @param options - Execution options
 * @param options.stdio - Stdio option
 * @param dryRun - Whether to perform a dry run
 * @returns The result of the command execution
 */
const execSyncOrDryRun = (
  command: string,
  options?: { stdio?: "inherit" },
  dryRun = false,
): Buffer | string => {
  if (!dryRun) {
    return execSync(command, options);
  }

  console.log(`[dry-run] ${command}`);

  return "";
};

/**
 * Release a project to NPM
 * @param projectName - The name of the project
 * @param project - The project configuration
 * @param options - Release options
 */
const releaseLocally = async (
  projectName: string,
  project: ProjectConfiguration,
  options: ReleaseProjectOptions,
): Promise<void> => {
  assertLocalRegistry();

  execSyncOrDryRun(
    `${NX_BUILD_COMMAND} ${projectName}`,
    { stdio: "inherit" },
    options.dryRun,
  );

  const outputPath = (
    project.targets?.build?.options as { outputPath?: string }
  ).outputPath;
  if (!outputPath) {
    throw new Error("Could not find outputPath in project configuration");
  }

  const packageJsonPath = !options.dryRun
    ? join(outputPath, PACKAGE_JSON)
    : join(project.root, PACKAGE_JSON);

  if (!existsSync(packageJsonPath)) {
    throw new Error(`Could not find package.json in ${packageJsonPath}`);
  }

  await standardVersion({
    bumpFiles: [packageJsonPath],
    dryRun: options.dryRun,
    packageFiles: [packageJsonPath],
    releaseAs: options.version,
    skip: {
      changelog: true,
      commit: true,
      tag: true,
    },
  });

  execSyncOrDryRun(
    `${NPM_PUBLISH_COMMAND} ${outputPath} --access=public`,
    { stdio: "inherit" },
    options.dryRun,
  );
};

/**
 * Release a project to NPM
 * @param projectName - The name of the project
 * @param project - The project configuration
 * @param options - Release options
 */
const releaseToNpm = async (
  projectName: string,
  project: ProjectConfiguration,
  options: ReleaseProjectOptions,
): Promise<void> => {
  const packageJsonPath = join(project.root, PACKAGE_JSON);

  const standardVersionOptions: standardVersion.Options & { verify: boolean } =
    {
      bumpFiles: [packageJsonPath],
      dryRun: options.dryRun,
      infile: `${project.root}/CHANGELOG.md`,
      packageFiles: [packageJsonPath],
      path: project.root,
      releaseCommitMessageFormat: `chore(release): @nxtensions/${projectName}@{{currentTag}}`,
      scripts: {
        postchangelog: "npx nx format:write",
      },
      tagPrefix: `@nxtensions/${projectName}@v`,
      verify: false,
    };

  if (options.version) {
    standardVersionOptions.releaseAs = options.version;
  }

  await standardVersion(standardVersionOptions);

  execSyncOrDryRun(
    `${NX_BUILD_COMMAND} ${projectName}`,
    { stdio: "inherit" },
    options.dryRun,
  );

  const outputPath = (
    project.targets?.build?.options as { outputPath?: string }
  ).outputPath;

  execSyncOrDryRun(
    `${NPM_PUBLISH_COMMAND} ${outputPath}`,
    { stdio: "inherit" },
    options.dryRun,
  );

  execSyncOrDryRun(
    "git push --follow-tags origin main",
    { stdio: "inherit" },
    options.dryRun,
  );
};

export const command = defineCommand({
  args: {
    dryRun: {
      description: "Do not make any changes, but output the steps",
      type: "boolean",
    },
    local: {
      description: "Release locally",
      type: "boolean",
    },
    project: {
      description: "Project name",
      required: true,
      type: "string",
    },
    version: {
      description: "Version to release",
      type: "string",
    },
  },
  meta: {
    description: "Release a project using standard-version",
    name: "release-project",
  },
  run: async ({ args }) => {
    await releaseProject(args.project, {
      dryRun: args.dryRun || false,
      localRelease: args.local || false,
      version: args.version,
    });
  },
});
