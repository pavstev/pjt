import { defineCommand } from "citty";

import { execCommand } from "../lib/command";
import { requireCommand } from "../lib/requirements";

export const command = defineCommand({
  args: {
    extension: {
      description: "File extension filter",
      type: "positional",
    },
    term: {
      description: "Search term",
      required: true,
      type: "positional",
    },
  },
  meta: {
    description: "List project files matching a term",
    name: "list-project-files",
  },
  run: async ({ args }) => {
    // Try to use fd/fdfind if available, otherwise fall back to find
    const hasFd = requireCommand("fd") || requireCommand("fdfind");

    if (hasFd) {
      const fdCommand = requireCommand("fd") ? "fd" : "fdfind";
      const fdArgs = [
        "--no-ignore",
        "--exclude",
        "node_modules",
        "--exclude",
        "venv",
        "-type",
        "directory",
        args.term,
      ];

      if (args.extension) {
        fdArgs.push("-x", "fdfind", ".", "{}", `--extension=${args.extension}`);
      }

      await execCommand(fdCommand, fdArgs);
    } else {
      // Fallback to find command
      console.log("Warning: fd/fdfind not found, using find (slower)");

      let findArgs = [
        ".",
        "-name",
        `*${args.term}*`,
        "-type",
        "d",
        "-not",
        "-path",
        "*/node_modules/*",
        "-not",
        "-path",
        "*/venv/*",
      ];

      if (args.extension) {
        findArgs = [
          ".",
          "-name",
          `*${args.term}*`,
          "-name",
          `*.${args.extension}`,
          "-type",
          "f",
          "-not",
          "-path",
          "*/node_modules/*",
          "-not",
          "-path",
          "*/venv/*",
        ];
      }

      await execCommand("find", findArgs);
    }
  },
});
