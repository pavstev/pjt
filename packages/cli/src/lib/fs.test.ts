import { promises as fs } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
// eslint-disable-next-line n/no-extraneous-import
import { describe, expect, it } from "vitest";

import { createTempDir, pathExists } from "./fs";

describe("fs utilities", () => {
  const testDir = tmpdir();
  const testFile = join(testDir, "test.txt");

  describe("pathExists", () => {
    it("should return true for existing file", async () => {
      await fs.writeFile(testFile, "content");
      const result = await pathExists(testFile);
      expect(result).toBe(true);
      await fs.unlink(testFile);
    });

    it("should return false for non-existing file", async () => {
      const result = await pathExists(join(testDir, "nonexistent.txt"));
      expect(result).toBe(false);
    });
  });

  describe("createTempDir", () => {
    it("should create a temp directory", async () => {
      const tempDir = await createTempDir("test-");
      const exists = await pathExists(tempDir);
      expect(exists).toBe(true);
      await fs.rm(tempDir, { recursive: true });
    });
  });
});
