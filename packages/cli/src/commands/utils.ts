import type { ExecSyncOptions } from "node:child_process";

import { execSync } from "node:child_process";

/**
 * Execute a command or log it if dry run
 * @param command - The command to execute
 * @param options - Execution options
 * @param dryRun - Whether to perform a dry run
 * @returns The result of the command execution
 */
export const execSyncOrDryRun = (
  command: string,
  options?: ExecSyncOptions,
  dryRun = false,
): Buffer | string => {
  if (!dryRun) {
    return execSync(command, options);
  }

  console.log(`[dry-run] ${command}`);

  return "";
};
