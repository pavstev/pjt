import { defineCommand } from "citty";

import { execCommandOutput } from "../lib/command";

export const command = defineCommand({
  meta: {
    description: "Show commit diff stats with origin/main",
    name: "commit-diff",
  },
  run: async () => {
    const output = await execCommandOutput("git", [
      "rev-list",
      "--left-right",
      "--count",
      "HEAD...origin/main",
    ]);
    const [ahead, behind] = output.trim().split("\t").map(Number);
    console.log(`Behind: ${behind} | Ahead: ${ahead}`);
    console.log("------------------------------");
    await execCommandOutput("git", [
      "--no-pager",
      "diff",
      "--stat",
      "HEAD...origin/main",
    ]);
  },
});
