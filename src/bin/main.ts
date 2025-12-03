#!/usr/bin/env node

import { cac } from "cac";
import { commandRegistry, getDefaultCommand } from "./registry";
import { generateCompletions } from "../lib/completions";
import { CliUtils } from "../lib/cli-utils";
import { CommandExecutor } from "../lib/command-executor";
import { Git } from "../lib/git";
import { logger } from "../lib/logger";

const utils = new CliUtils(logger);
const commandExecutor = new CommandExecutor(logger);
const git = new Git(logger);
const cli = cac("pjt");

const defaultCommand = getDefaultCommand();
if (defaultCommand) {
  const command = cli.command("", defaultCommand.description);
  utils.setupCommand(command, defaultCommand, utils, git, commandExecutor);
}

commandRegistry.forEach(cmd => {
  const command = cli.command(cmd.name, cmd.description);
  utils.setupCommand(command, cmd, utils, git, commandExecutor);
});

cli
  .command("completions", "Generate shell completions")
  .option("--shell <shell>", "Shell type (bash, zsh, fish)")
  .action(options => {
    const shell = options.shell ?? "bash";
    try {
      console.log(generateCompletions(shell));
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

cli.help();
cli.version("1.0.18");

try {
  cli.parse();
} catch (error) {
  utils.handleError(error);
}
