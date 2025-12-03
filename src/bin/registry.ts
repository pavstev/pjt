import { CommandExecutor } from "../lib/command-executor";
import { CliUtils } from "../lib/cli-utils";
import { Git } from "../lib/git";
import { CommandDefinition, CommandHandler } from "../lib/types";

const createNpmScriptHandler =
  (scriptName: string): CommandHandler =>
  async (_utils: CliUtils, _git: Git, executor: CommandExecutor) => {
    await executor.exec(scriptName);
  };

export const commandRegistry: CommandDefinition[] = [
  {
    name: "git-clean",
    description: "Clean and manage package.json related files",
    handler: async (utils, git, _executor, options = {}): Promise<void> => {
      await utils.checkGitRepository();
      await git.clean({ dryRun: options.dryRun as boolean });
    },
    isDefault: true,
    options: [
      {
        name: "dry-run",
        description: "Show what would be cleaned without actually cleaning",
        type: "boolean",
      },
    ],
  },
  {
    name: "format",
    description: "Format code using the project's formatter",
    handler: createNpmScriptHandler("format"),
  },
  {
    name: "knip",
    description: "Check for unused dependencies and files",
    handler: createNpmScriptHandler("knip"),
  },
  {
    name: "lint",
    description: "Lint the codebase",
    handler: createNpmScriptHandler("lint"),
  },
  {
    name: "build",
    description: "Build the project",
    handler: createNpmScriptHandler("build"),
  },
  {
    name: "test",
    description: "Run tests",
    handler: createNpmScriptHandler("test"),
  },
  {
    name: "npm-clean-versions",
    description: "Delete all npm versions except 1.00",
    handler: async (utils, _git, executor, options = {}): Promise<void> => {
      const dryRun = options.dryRun as boolean;
      const packageJson = await import("../../package.json");
      const packageName = packageJson.name;

      // Get all versions
      const versionsOutput = (await executor.execNpmCommand(
        ["view", packageName, "versions", "--json"],
        true,
      )) as string;
      const versions = JSON.parse(versionsOutput);

      // Filter out version 1.00
      const versionsToDelete = versions.filter(
        (version: string) => version !== "1.00",
      );

      if (versionsToDelete.length === 0) {
        console.log(
          "No versions to delete (only 1.00 exists or no versions found)",
        );
        return;
      }

      console.log(
        `Found ${versionsToDelete.length} versions to delete: ${versionsToDelete.join(", ")}`,
      );

      if (dryRun) {
        console.log("Dry run mode - would delete the following versions:");
        versionsToDelete.forEach((version: string) => {
          console.log(`  npm unpublish ${packageName}@${version}`);
        });
        return;
      }

      // Delete each version
      for (const version of versionsToDelete) {
        try {
          await executor.execNpmCommand([
            "unpublish",
            `${packageName}@${version}`,
          ]);
          console.log(`Successfully deleted version ${version}`);
        } catch (error) {
          console.error(`Failed to delete version ${version}: ${error}`);
        }
      }
    },
    options: [
      {
        name: "dry-run",
        description: "Show what would be deleted without actually deleting",
        type: "boolean",
      },
    ],
  },
];

export const getDefaultCommand = (): CommandDefinition | undefined =>
  commandRegistry.find(cmd => cmd.isDefault);
