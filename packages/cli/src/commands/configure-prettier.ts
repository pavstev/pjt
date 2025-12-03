import { configure } from "@pjt/prettier";
import { defineCommand } from "citty";
import { writeFile } from "node:fs/promises";

const configurePrettier = defineCommand({
  meta: {
    name: "configure-prettier",
    description: "Configure Prettier with plugins",
  },
  async run() {
    try {
      await configure({
        cwd: process.cwd(),
        writeFile,
        logger: console,
      });
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  },
});

export default configurePrettier;
