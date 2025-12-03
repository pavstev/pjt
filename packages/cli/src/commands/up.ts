import { defineCommand } from "citty";
import { resolve } from "node:path";

export const command = defineCommand({
  args: {
    count: {
      default: "1",
      description: "Number of directories to go up",
      type: "positional",
    },
  },
  meta: {
    description: "Go up N directories",
    name: "up",
  },
  run: ({ args }) => {
    const count = args.count || "1";
    const countNum = parseInt(count, 10);
    if (isNaN(countNum) || countNum < 1) {
      throw new Error("count must be a positive number");
    }

    let targetPath = process.cwd();
    for (let i = 0; i < countNum; i++) {
      targetPath = resolve(targetPath, "..");
    }

    process.chdir(targetPath);
    console.log(`Changed directory to: ${targetPath}`);
  },
});
