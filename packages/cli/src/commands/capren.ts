import { defineCommand } from "citty";

import { execCommand } from "../lib/command";

export const command = defineCommand({
  meta: {
    description: "Build and run capren tool",
    name: "capren",
  },
  run: async () => {
    await execCommand("pnpm", ["-s", "-C", "tools/capren", "build"], {
      stdout: "ignore",
    });
    await execCommand("node", ["./tools/capren/dist/main.js"]);
  },
});
