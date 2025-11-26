import { promises as fs } from "node:fs";
import { join } from "node:path";

export const removeEmptyDirectories = async (dir: string): Promise<void> => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      await removeEmptyDirectories(fullPath);
    }
  }
  // After processing subdirs, check if current dir is empty
  const remaining = await fs.readdir(dir);
  if (remaining.length === 0) {
    await fs.rmdir(dir);
  }
};
