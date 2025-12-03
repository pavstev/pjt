import { defineCommand } from "citty";

import configurePrettier from "./commands/configure-prettier";
import gitClean from "./commands/git-clean";

const main = defineCommand({
  meta: {
    description: "Project tooling CLI",
    name: "pjt",
  },
  subCommands: {
    "configure-prettier": configurePrettier,
    "git-clean": gitClean,
  },
});

export default main;
