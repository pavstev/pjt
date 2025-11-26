import { describe, it, expect, vi } from "vitest";
import { promises as fs } from "node:fs";
import { readdirSync } from "node:fs";
import { execa } from "execa";
import {
  validateDirectory,
  validateGitCleanOptions,
  execPromise,
  getIgnorePatterns,
} from "./utils.js";

vi.mock("node:fs", () => ({
  promises: {
    stat: vi.fn(),
  },
  readdirSync: vi.fn(),
}));

vi.mock("execa", () => ({
  execa: vi.fn(),
}));

vi.mock("globify-gitignore", () => ({
  globifyGitIgnore: vi.fn(),
}));

vi.mock("./logger.js", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

import { logger } from "./logger.js";
import { globifyGitIgnore } from "globify-gitignore";

describe("validateDirectory", () => {
  it("should throw on invalid directory path", async () => {
    await expect(validateDirectory("")).rejects.toThrow(
      "Invalid directory path",
    );
    await expect(validateDirectory(null as any)).rejects.toThrow(
      "Invalid directory path",
    );
  });

  it("should throw if path is not a directory", async () => {
    const mockStat = vi.mocked(fs.stat);
    mockStat.mockResolvedValue({ isDirectory: () => false } as any);

    await expect(validateDirectory("/test")).rejects.toThrow(
      "/test is not a directory",
    );
  });

  it("should pass for valid directory", async () => {
    const mockStat = vi.mocked(fs.stat);
    mockStat.mockResolvedValue({ isDirectory: () => true } as any);

    await expect(validateDirectory("/test")).resolves.toBeUndefined();
  });

  it("should throw on stat error", async () => {
    const mockStat = vi.mocked(fs.stat);
    mockStat.mockRejectedValue(new Error("Not found"));

    await expect(validateDirectory("/test")).rejects.toThrow(
      "Directory /test does not exist or is inaccessible",
    );
  });
});

describe("validateGitCleanOptions", () => {
  it("should throw on non-object options", () => {
    expect(() => validateGitCleanOptions(null)).toThrow(
      "options must be an object",
    );
    expect(() => validateGitCleanOptions("string")).toThrow(
      "options must be an object",
    );
  });

  it("should throw on invalid exclude", () => {
    expect(() => validateGitCleanOptions({ exclude: "string" })).toThrow(
      "exclude must be an array of strings",
    );
  });

  it("should throw on invalid dryRun", () => {
    expect(() => validateGitCleanOptions({ dryRun: "string" })).toThrow(
      "dryRun must be a boolean",
    );
  });

  it("should pass on valid options", () => {
    expect(() =>
      validateGitCleanOptions({ exclude: ["test"], dryRun: true }),
    ).not.toThrow();
    expect(() => validateGitCleanOptions({})).not.toThrow();
  });
});

describe("execPromise", () => {
  it("should resolve on successful command", async () => {
    const mockExeca = vi.mocked(execa);
    mockExeca.mockResolvedValue({ stdout: "output", stderr: "" });

    await expect(execPromise("test command")).resolves.toBeUndefined();
    expect(logger.info).toHaveBeenCalledWith("Executing: test command");
    expect(logger.info).toHaveBeenCalledWith("output");
  });

  it("should reject on command error", async () => {
    const mockExeca = vi.mocked(execa);
    const error = new Error("Command failed");
    (error as any).stderr = "stderr";
    mockExeca.mockRejectedValue(error);

    await expect(execPromise("test command")).rejects.toThrow(
      "Command execution failed: test command",
    );
    expect(logger.error).toHaveBeenCalledWith("Command failed: test command");
    expect(logger.error).toHaveBeenCalledWith("stderr");
  });
});

describe("getIgnorePatterns", () => {
  it("should return flattened ignore patterns", async () => {
    const mockReaddir = vi.mocked(readdirSync);
    const mockGlobify = vi.mocked(globifyGitIgnore);

    mockReaddir.mockReturnValue([".gitignore", ".eslintignore"]);
    mockGlobify.mockResolvedValueOnce([
      { included: true, glob: "*.log" },
      { included: false, glob: "*.tmp" },
    ]);
    mockGlobify.mockResolvedValueOnce([{ included: true, glob: "*.js" }]);

    const result = await getIgnorePatterns();

    expect(result).toEqual(["*.log", "*.js"]);
    expect(mockGlobify).toHaveBeenCalledTimes(2);
  });

  it("should handle globify errors gracefully", async () => {
    const mockReaddir = vi.mocked(readdirSync);
    const mockGlobify = vi.mocked(globifyGitIgnore);

    mockReaddir.mockReturnValue([".gitignore"]);
    mockGlobify.mockRejectedValue(new Error("Parse error"));

    const result = await getIgnorePatterns();

    expect(result).toEqual([]);
    expect(logger.warn).toHaveBeenCalled();
  });

  it("should throw on readdir error", async () => {
    const mockReaddir = vi.mocked(readdirSync);
    mockReaddir.mockImplementation(() => {
      throw new Error("Read error");
    });

    await expect(getIgnorePatterns()).rejects.toThrow(
      "Failed to read ignore patterns",
    );
    expect(logger.error).toHaveBeenCalled();
  });
});
