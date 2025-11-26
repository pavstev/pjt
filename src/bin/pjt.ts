#!/usr/bin/env node

import { handlePackageJsonTools } from "./commands/package-json-tools.js";
import { handleAiCommit } from "./commands/ai-commit.js";
import { printHelp } from "./commands/help.js";
import { printVersion } from "./commands/version.js";

const main = async () => {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "package-json-tools") {
    await handlePackageJsonTools();
  } else if (args[0] === "--version" || args[0] === "-v") {
    printVersion();
  } else if (args[0] === "--help" || args[0] === "-h") {
    printHelp();
  } else if (args[0] === "ai-commit") {
    await handleAiCommit();
  } else {
    console.error(`Unknown command: ${args[0]}`);
    process.exit(1);
  }
};

main();
