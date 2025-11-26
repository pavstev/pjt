#!/usr/bin/env node

import { promises as fs } from "node:fs";
import { gitCleanCommand } from "../index.js";

const main = async () => {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "package-json-tools") {
    try {
      // Check if in git repository
      await fs.access(".git");
      await gitCleanCommand();
    } catch (error) {
      if (
        error instanceof Error &&
        "code" in error &&
        error.code === "ENOENT"
      ) {
        console.error("Error: Not a git repository");
      } else if (error instanceof Error) {
        console.error("Error:", error.message);
      } else {
        console.error("Error:", String(error));
      }
      process.exit(1);
    }
  } else if (args[0] === "--version" || args[0] === "-v") {
    console.log("1.0.0");
  } else if (args[0] === "--help" || args[0] === "-h") {
    console.log("pjt [command]");
    console.log("");
    console.log("Commands:");
    console.log(
      "  package-json-tools  Clean git repository by removing untracked files",
    );
    console.log("");
    console.log("Options:");
    console.log("  -v, --version  output the version number");
    console.log("  -h, --help     display help for command");
  } else {
    console.error(`Unknown command: ${args[0]}`);
    process.exit(1);
  }
};

main();
