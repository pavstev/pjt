import { defineCommand } from "citty";
import { glob } from "glob";
import inquirer from "inquirer";

import { execCommand } from "../lib/command";
import { requireCommand } from "../lib/requirements";

export const command = defineCommand({
  meta: {
    description: "Preview files using bat or cat",
    name: "preview",
  },
  run: async () => {
    // Get all files (respecting .gitignore would be complex, so we'll get all files)
    const files = await glob("**/*", {
      ignore: ["node_modules/**", ".git/**", "dist/**"],
      nodir: true,
    });

    if (files.length === 0) {
      console.log("No files found");
      return;
    }

    // Use inquirer for file selection (since fzf might not be available)
    const answers = await inquirer.prompt<{ selectedFile: string }>([
      {
        choices: files.slice(0, 100), // Limit for performance
        message: "Select file to preview:",
        name: "selectedFile",
        pageSize: 20,
        type: "list",
      },
    ]);

    if (answers.selectedFile) {
      // Try to use bat for syntax highlighting, fall back to cat
      const hasBat = requireCommand("bat");

      if (hasBat) {
        await execCommand("bat", [
          "--color=always",
          "--style=numbers,changes",
          answers.selectedFile,
        ]);
      } else {
        await execCommand("cat", [answers.selectedFile]);
      }
    }
  },
});
