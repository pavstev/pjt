import { defineCommand } from "citty";

import { execCommand } from "../lib/command";
import { requireCommand } from "../lib/requirements";

export const command = defineCommand({
  meta: {
    description: "Count lines of code using cloc",
    name: "loc",
  },
  run: async () => {
    if (!requireCommand("cloc")) {
      throw new Error("cloc command not found");
    }

    await execCommand("cloc", [
      "--vcs=git",
      "--quiet",
      "--exclude-lang=YAML,Markdown,JSON",
    ]);
  },
});
