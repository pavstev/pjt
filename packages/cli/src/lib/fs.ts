import { access, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

/**
 * Checks if a path exists.
 * @param path - The path to check.
 * @returns True if the path exists, false otherwise.
 */
export const pathExists = async (path: string): Promise<boolean> =>
  access(path).then(
    () => true,
    () => false,
  );

/**
 * Creates a temporary directory with a prefix.
 * @param prefix - The prefix for the temp directory.
 * @returns The path to the created temp directory.
 */
export const createTempDir = async (prefix: string): Promise<string> =>
  mkdtemp(join(tmpdir(), prefix));
