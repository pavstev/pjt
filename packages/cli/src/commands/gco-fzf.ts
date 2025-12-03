import { defineCommand } from "citty";
import { execa } from "execa";
import inquirer from "inquirer";

import { execCommand, execCommandOutput } from "../lib/command";
import { requireCommand, requireGitRepo } from "../lib/requirements";

export const command = defineCommand({
  meta: {
    description: "Checkout git branch using fzf or inquirer",
    name: "gco-fzf",
  },
  run: async () => {
    if (!requireGitRepo()) {
      throw new Error("Not a git repository");
    }

    // Get all branches
    const branchesOutput = await execCommandOutput("git", [
      "branch",
      "--all",
      "--format=%(refname:short)",
    ]);
    const branches = branchesOutput.split("\n").filter(branch => branch.trim());

    if (branches.length === 0) {
      console.log("No branches found");
      return;
    }

    // Try to use fzf if available, otherwise fall back to inquirer
    const hasFzf = requireCommand("fzf");

    let selectedBranch: string;

    if (hasFzf) {
      // Use fzf for interactive selection
      const fzf = execa(
        "fzf",
        ["--height", "40%", "--reverse", "--prompt=Checkout branch > "],
        {
          input: branches.join("\n"),
          stdio: ["pipe", "pipe", "inherit"],
        },
      );

      const result = await fzf;
      selectedBranch = result.stdout.trim();
    } else {
      // Fallback to inquirer
      const answers = await inquirer.prompt<{ branch: string }>([
        {
          choices: branches,
          message: "Select branch to checkout:",
          name: "branch",
          type: "list",
        },
      ]);
      selectedBranch = answers.branch;
    }

    if (selectedBranch) {
      await execCommand("git", ["checkout", selectedBranch]);
      console.log(`Checked out branch: ${selectedBranch}`);
    }
  },
});
