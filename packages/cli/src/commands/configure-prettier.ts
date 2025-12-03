import { configure } from "@pjt/prettier";
import { defineCommand } from "citty";
import { writeFile } from "node:fs/promises";

const configurePrettier = defineCommand({
  meta: {
    description: "Configure Prettier with plugins",
    name: "configure-prettier",
  },
  run: async () => {
    await configure({
      cwd: process.cwd(),
      logger: console,
      writeFile,
    });
  },
});

export default configurePrettier;
