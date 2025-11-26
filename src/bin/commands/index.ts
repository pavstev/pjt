import { Command } from "../../types";
import { handleGitClean } from "./git-clean";
import { handleAiCommit } from "./ai-commit";
import { printHelp } from "./help";
import { printVersion } from "./version";

export const commands: Command[] = [
  {
    name: "git-clean",
    description: "Clean and manage package.json related files",
    handler: handleGitClean,
  },
  {
    name: "ai-commit",
    description: "Generate AI-powered commit messages",
    handler: handleAiCommit,
  },
  {
    name: "--help",
    description: "Show help information",
    handler: printHelp,
  },
  {
    name: "-h",
    description: "Show help information",
    handler: printHelp,
  },
  {
    name: "--version",
    description: "Show version information",
    handler: printVersion,
  },
  {
    name: "-v",
    description: "Show version information",
    handler: printVersion,
  },
];
