import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("node:child_process", () => ({
  exec: vi.fn(),
}));

vi.mock("node:fs", () => ({
  readdirSync: vi.fn(),
}));

vi.mock("node:path", () => ({
  join: vi.fn(),
}));

vi.mock("globify-gitignore", () => ({
  globifyGitIgnore: vi.fn(),
}));

import { exec } from "node:child_process";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { globifyGitIgnore } from "globify-gitignore";
import { execPromise, getIgnorePatterns } from "./utils";

const mockedExec = vi.mocked(exec);
const mockedReaddirSync = vi.mocked(readdirSync);
const mockedJoin = vi.mocked(join);
const mockedGlobifyGitIgnore = vi.mocked(globifyGitIgnore);

describe("execPromise", () => {
  it("should resolve when exec succeeds", async () => {
    mockedExec.mockImplementation((command, callback: any) => {
      if (callback) callback(null, "", "");
      return {} as any;
    });

    await expect(execPromise("test command")).resolves.toBeUndefined();
    expect(mockedExec).toHaveBeenCalledWith(
      "test command",
      expect.any(Function),
    );
  });

  it("should reject when exec fails", async () => {
    const error = new Error("exec error");
    mockedExec.mockImplementation((command, callback: any) => {
      if (callback) callback(error, "", "");
      return {} as any;
    });

    await expect(execPromise("test command")).rejects.toThrow("exec error");
  });
});

describe("getIgnorePatterns", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return empty array when no ignore files", async () => {
    (mockedReaddirSync as any).mockReturnValue([]);
    const result = await getIgnorePatterns();
    expect(result).toEqual([]);
    expect(mockedReaddirSync).toHaveBeenCalledWith(".", {
      encoding: "utf8",
      recursive: false,
    });
  });

  it("should return patterns from ignore files", async () => {
    (mockedReaddirSync as any).mockReturnValue([".gitignore", ".eslintignore"]);
    mockedJoin.mockImplementation((...args) => args.join("/"));
    mockedGlobifyGitIgnore.mockResolvedValue([
      { included: true, glob: "node_modules/**" },
      { included: false, glob: "src/**" },
      { included: true, glob: "*.log" },
    ]);

    const result = await getIgnorePatterns();
    expect(result).toEqual([
      "node_modules/**",
      "*.log",
      "node_modules/**",
      "*.log",
    ]);
    expect(mockedReaddirSync).toHaveBeenCalledWith(".", {
      encoding: "utf8",
      recursive: false,
    });
    expect(mockedJoin).toHaveBeenCalledTimes(2);
    expect(mockedGlobifyGitIgnore).toHaveBeenCalledTimes(2);
  });

  it("should filter files that match ignore pattern", async () => {
    (mockedReaddirSync as any).mockReturnValue([
      ".gitignore",
      "normal.txt",
      ".eslintignore",
    ]);
    mockedJoin.mockImplementation((...args) => args.join("/"));
    mockedGlobifyGitIgnore.mockResolvedValue([
      { included: true, glob: "dist/**" },
    ]);

    const result = await getIgnorePatterns();
    expect(result).toEqual(["dist/**", "dist/**"]);
    expect(mockedGlobifyGitIgnore).toHaveBeenCalledTimes(2);
  });
});
