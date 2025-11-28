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
];

export const getDefaultCommand = (): CommandDefinition | undefined =>
  commandRegistry.find(cmd => cmd.isDefault);
