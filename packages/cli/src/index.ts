import { defineCommand } from "citty";
import configurePrettier from "./commands/configure-prettier";
import gitClean from "./commands/git-clean";

const main = defineCommand({
  meta: {
    name: "pjt",
    description: "Project tooling CLI",
  },
  subCommands: {
    "git-clean": gitClean,
    "configure-prettier": configurePrettier,
  },
});

export default main;
