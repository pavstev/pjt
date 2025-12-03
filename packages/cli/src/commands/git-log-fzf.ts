import { defineCommand } from "citty";
import { execa } from "execa";
import inquirer from "inquirer";

import { execCommand, execCommandOutput } from "../lib/command";
import { requireCommand, requireGitRepo } from "../lib/requirements";

const COLOR_ALWAYS = "--color=always";

export const command = defineCommand({
  meta: {
    description: "Browse git log using fzf or inquirer",
    name: "git-log-fzf",
  },
  run: async () => {
    if (!requireGitRepo()) {
      throw new Error("Not a git repository");
    }

    // Try to use fzf if available, otherwise fall back to inquirer
    const hasFzf = requireCommand("fzf");

    if (hasFzf) {
      // Use fzf for interactive selection
      const gitLog = await execa(
        "git",
        [
          "log",
          "--graph",
          COLOR_ALWAYS,
          "--format=%C(auto)%h%d %s %C(green)(%cr) %C(bold blue)<%an>%C(reset)",
          "--all",
        ],
        { stdio: "pipe" },
      );

      const fzf = execa(
        "fzf",
        [
          "--ansi",
          "--no-sort",
          "--reverse",
          "--tiebreak=index",
          "--height",
          "100%",
        ],
        {
          input: gitLog.stdout,
          stdio: ["pipe", "pipe", "inherit"],
        },
      );

      const result = await fzf;
      if (result.stdout.trim()) {
        // Extract commit hash and show diff
        const commitHash = result.stdout.split(" ")[0];
        if (commitHash) {
          await execCommand("git", ["show", COLOR_ALWAYS, commitHash]);
        }
      }
    } else {
      // Fallback to inquirer for cross-platform compatibility
      const gitLogOutput = await execCommandOutput("git", [
        "log",
        "--oneline",
        "--all",
        "-20",
      ]);

      const commits = gitLogOutput
        .split("\n")
        .filter((line: string) => line.trim());
      const choices = commits.map((line: string) => ({
        name: line,
        value: line.split(" ")[0],
      }));

      const answers = await inquirer.prompt<{ selectedCommit: string }>([
        {
          choices,
          message: "Select a commit to view:",
          name: "selectedCommit",
          type: "list",
        },
      ]);

      if (answers.selectedCommit) {
        await execCommand("git", [
          "show",
          COLOR_ALWAYS,
          answers.selectedCommit,
        ]);
      }
    }
  },
});
