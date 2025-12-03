import { CommandExecutor } from "../lib/command-executor";
import { CliUtils } from "../lib/cli-utils";
import { Git } from "../lib/git";
import { CommandDefinition, CommandHandler } from "../lib/types";
import { spawn } from "node:child_process";

const execCommand = (command: string, args: string[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: false, // Don't use shell to avoid argument parsing issues
    });
    child.on("close", code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed: ${command} ${args.join(" ")}`));
      }
    });
    child.on("error", reject);
  });
};

const execShellCommand = (command: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, [], {
      stdio: "inherit",
      shell: true,
    });
    child.on("close", code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed: ${command}`));
      }
    });
    child.on("error", reject);
  });
};

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
    description: "Clean npm versions, commit changes, and republish",
    handler: async (utils, git, executor, options = {}): Promise<void> => {
      const dryRun = options.dryRun as boolean;
      const packageJson = await import("../../package.json");
      const packageName = packageJson.name;

      // Get all published versions
      const versionsOutput = (await executor.execNpmCommand(
        ["view", packageName, "versions", "--json"],
        true,
      )) as string;
      const publishedVersions = JSON.parse(versionsOutput);

      if (publishedVersions.length === 0) {
        console.log("No published versions found");
        return;
      }

      // Sort versions and keep the latest published one
      const sortedVersions = publishedVersions.sort((a: string, b: string) =>
        a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
      );
      const latestPublishedVersion = sortedVersions[sortedVersions.length - 1];
      const versionsToDelete = publishedVersions.filter(
        (version: string) => version !== latestPublishedVersion,
      );

      console.log(
        `Keeping latest published version: ${latestPublishedVersion}`,
      );
      console.log(
        `Found ${versionsToDelete.length} versions to delete: ${versionsToDelete.join(", ")}`,
      );

      if (dryRun) {
        console.log("Dry run mode - would:");
        versionsToDelete.forEach((version: string) => {
          console.log(`  - Delete version ${version}`);
        });
        console.log(
          `  - Commit changes with message "chore: clean npm versions, keep ${latestPublishedVersion}"`,
        );
        console.log("  - Bump version and republish");
        return;
      }

      // Delete old versions
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

      // Commit changes if any versions were deleted
      if (versionsToDelete.length > 0) {
        try {
          await execCommand("git", ["add", "."]);
          await execShellCommand(
            `git commit -m "chore: clean npm versions, keep ${latestPublishedVersion}"`,
          );
          console.log("Committed version cleanup");
        } catch (error) {
          console.error(`Failed to commit changes: ${error}`);
        }
      }

      // Bump to next patch version and republish
      try {
        const versionParts = latestPublishedVersion.split(".");
        const newVersion = `${versionParts[0]}.${versionParts[1]}.${parseInt(versionParts[2]) + 1}`;

        console.log(
          `Bumping version from ${latestPublishedVersion} to ${newVersion}`,
        );
        await executor.execNpmCommand(
          ["version", newVersion, "--no-git-tag-version"],
          false,
        );

        console.log(`Publishing version ${newVersion}...`);
        await executor.execNpmCommand(["publish"], false);
        console.log(`Successfully published version ${newVersion}`);

        // Commit the version bump
        await execCommand("git", ["add", "."]);
        await execShellCommand(
          `git commit -m "chore: bump version to ${newVersion}"`,
        );
        console.log(`Committed version bump to ${newVersion}`);
      } catch (error) {
        console.error(`Failed to republish: ${error}`);
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
