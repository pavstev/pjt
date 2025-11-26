import { describe, it, expect, vi, beforeEach } from "vitest";
import { promises as fs } from "node:fs";
import { removeEmptyDirectories } from "./fs.js";

vi.mock("node:fs", () => ({
  promises: {
    readdir: vi.fn(),
    rmdir: vi.fn(),
  },
}));

vi.mock("./utils.js", () => ({
  validateDirectory: vi.fn(),
}));

vi.mock("./logger.js", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

import { validateDirectory } from "./utils.js";
import { logger } from "./logger.js";

describe("removeEmptyDirectories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("should remove empty directory", async () => {
    const mockValidate = vi.mocked(validateDirectory);
    const mockReaddir = vi.mocked(fs.readdir);
    const mockRmdir = vi.mocked(fs.rmdir);
    const mockLoggerInfo = vi.mocked(logger.info);

    mockValidate.mockResolvedValue(undefined);
    mockReaddir.mockResolvedValueOnce([]); // No entries
    mockReaddir.mockResolvedValueOnce([]); // Empty after check

    await removeEmptyDirectories("/test");

    expect(mockValidate).toHaveBeenCalledWith("/test");
    expect(mockReaddir).toHaveBeenCalledTimes(2);
    expect(mockLoggerInfo).toHaveBeenCalledWith(
      "Removing empty directory: /test",
    );
    expect(mockRmdir).toHaveBeenCalledWith("/test");
  });

  it("should recurse into subdirectories", async () => {
    const mockValidate = vi.mocked(validateDirectory);
    const mockReaddir = vi.mocked(fs.readdir);
    const mockRmdir = vi.mocked(fs.rmdir);
    const mockLoggerInfo = vi.mocked(logger.info);

    mockValidate.mockResolvedValue(undefined);
    // First call for /test: has a subdirectory
    mockReaddir.mockResolvedValueOnce([
      { name: "subdir", isDirectory: () => true },
    ]);
    // Second call for /test/subdir: empty
    mockReaddir.mockResolvedValueOnce([]);
    // Third call for /test/subdir: empty
    mockReaddir.mockResolvedValueOnce([]);
    // Fourth call for /test: now empty
    mockReaddir.mockResolvedValueOnce([]);

    await removeEmptyDirectories("/test");

    expect(mockRmdir).toHaveBeenCalledWith("/test/subdir");
    expect(mockRmdir).toHaveBeenCalledWith("/test");
  });

  it("should not remove non-empty directory", async () => {
    const mockValidate = vi.mocked(validateDirectory);
    const mockReaddir = vi.mocked(fs.readdir);
    const mockRmdir = vi.mocked(fs.rmdir);

    mockValidate.mockResolvedValue(undefined);
    // First call: no subdirs
    mockReaddir.mockResolvedValueOnce([]);
    // Second call: has file
    mockReaddir.mockResolvedValueOnce(["file.txt"]);

    await removeEmptyDirectories("/test");

    expect(mockRmdir).not.toHaveBeenCalled();
  });

  it("should throw FsError on failure", async () => {
    const mockValidate = vi.mocked(validateDirectory);
    const mockReaddir = vi.mocked(fs.readdir);
    const mockLoggerError = vi.mocked(logger.error);

    mockValidate.mockResolvedValue(undefined);
    mockReaddir.mockRejectedValue(new Error("Read error"));

    await expect(removeEmptyDirectories("/test")).rejects.toThrow(
      "Failed to process directory /test",
    );
    expect(mockLoggerError).toHaveBeenCalled();
  });
});
