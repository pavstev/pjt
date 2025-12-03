import { execSync } from "node:child_process";

/**
 * Check if a command exists in PATH
 * @param command - The command to check
 * @returns True if command exists
 */
export const commandExists = (command: string): boolean => {
  try {
    execSync(`which ${command}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
};
