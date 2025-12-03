import { defineCommand } from "citty";

import { createAndEnterDirectory } from "../lib/command";

export const command = defineCommand({
  args: {
    directory: {
      description: "Directory name to create and enter",
      required: true,
      type: "positional",
    },
  },
  meta: {
    description: "Create and enter a directory",
    name: "mkcd",
  },
  run: ({ args }) => {
    createAndEnterDirectory(args.directory);
  },
});
