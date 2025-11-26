import { unlink, writeFile } from "node:fs/promises";
import { execa } from "execa";
import consola from "consola";
import { CommandExecutor } from "../lib/command-executor";
import { CliUtils } from "../lib/cli-utils";
import { Git } from "../lib/git";

export type CommandDefinition = {
  name: string;
  description: string;
  handler: (
    utils: CliUtils,
    git: Git,
    executor: CommandExecutor,
  ) => Promise<void>;
  isDefault?: boolean;
};

const createNpmScriptHandler =
  (scriptName: string) =>
  async (_utils: CliUtils, _git: Git, executor: CommandExecutor) => {
    await executor.exec(`npm run ${scriptName}`);
  };

export const commandRegistry: CommandDefinition[] = [
  {
    name: "git-clean",
    description: "Clean and manage package.json related files",
    handler: async (utils, git) => {
      await utils.checkGitRepository();
      await git.clean();
    },
    isDefault: true,
  },
  {
    name: "ai-commit",
    description: "Generate AI-powered commit messages",
    handler: async (utils, _git, executor) => {
      await utils.checkGitRepository();
      await executor.exec("git add .");
      const diff = (await execa("git diff --cached", { shell: true })).stdout;
      if (!diff.trim()) {
        consola.info("No changes to commit.");
        return;
      }
      const diffFile = "/tmp/ai-commit-diff.txt";
      await writeFile(diffFile, diff);
      const message = (
        await execa(
          `opencode run "Generate an optimized, concise commit message for these changes" -f "${diffFile}"`,
          { shell: true },
        )
      ).stdout;
      await unlink(diffFile);
      await executor.exec(
        `git commit -m "${message.trim().replace(/"/g, '\\"')}"`,
      );
      await executor.exec("git push --force");
      consola.info("AI commit and push completed.");
    },
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

export const getDefaultCommand = () =>
  commandRegistry.find(cmd => cmd.isDefault);
