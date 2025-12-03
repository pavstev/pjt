import type { DetectResult } from "package-manager-detector";

import { detect } from "package-manager-detector";
import { exec } from "tinyexec";

/**
 * Install packages using detected package manager
 * @param packages - Array of package names to install
 * @returns Promise that resolves when installation is complete
 */
export const installPackages = async (packages: string[]): Promise<void> => {
  if (packages.length === 0) return;

  console.log(`Installing ${packages.length} prettier plugins...`);

  try {
    await exec("pnpm", ["add", "-D", ...packages]);
  } catch (error) {
    throw new Error(
      `Failed to install packages: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

/**
 * Detect package manager for a given directory
 * @param cwd - Directory to detect package manager in
 * @returns Promise resolving to detected package manager result or null
 */
export const detectPackageManager = async (
  cwd: string = process.cwd(),
): Promise<DetectResult | null> => await detect({ cwd });
