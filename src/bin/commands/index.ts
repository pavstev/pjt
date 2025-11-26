import { Command } from "../../types";
import { handleGitClean } from "./git-clean";
import { handleAiCommit } from "./ai-commit";
import { printHelp } from "./help";
import { printVersion } from "./version";

export const commands = new Map<string, Command>([
  [
    "git-clean",
    {
      name: "git-clean",
      description: "Clean and manage package.json related files",
      handler: handleGitClean,
    },
  ],
  [
    "ai-commit",
    {
      name: "ai-commit",
      description: "Generate AI-powered commit messages",
      handler: handleAiCommit,
    },
  ],
  [
    "--help",
    {
      name: "--help",
      description: "Show help information",
      handler: printHelp,
    },
  ],
  [
    "-h",
    {
      name: "-h",
      description: "Show help information",
      handler: printHelp,
    },
  ],
  [
    "--version",
    {
      name: "--version",
      description: "Show version information",
      handler: printVersion,
    },
  ],
  [
    "-v",
    {
      name: "-v",
      description: "Show version information",
      handler: printVersion,
    },
  ],
]);
