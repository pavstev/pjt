#!/usr/bin/env node

import { commands } from "./commands";
import { handleError } from "./cli-utils";

const main = async () => {
  const args = process.argv.slice(2);
  const commandName = args.length === 0 ? "package-json-tools" : args[0];

  const command = commands.find(cmd => cmd.name === commandName);

  if (!command) {
    console.error(`Unknown command: ${commandName}`);
    console.error("Run --help for available commands");
    process.exit(1);
  }

  try {
    await command.handler();
  } catch (error) {
    handleError(error);
  }
};

main();
