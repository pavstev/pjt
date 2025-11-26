import { describe, it, expect, vi, beforeEach } from "vitest";
import { removeEmptyDirectories } from "./fs.js";

vi.mock("node:fs", () => ({
  promises: {
    readdir: vi.fn(),
    rmdir: vi.fn(),
  },
}));

import { promises as fs } from "node:fs";

const mockedReaddir = vi.mocked(fs.readdir);
const mockedRmdir = vi.mocked(fs.rmdir);

describe("removeEmptyDirectories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("should remove empty directory", async () => {
    mockedReaddir.mockResolvedValue([]);
    mockedRmdir.mockResolvedValue();

    await removeEmptyDirectories("/empty");

    expect(mockedReaddir).toHaveBeenCalledWith("/empty", {
      withFileTypes: true,
    });
    expect(mockedReaddir).toHaveBeenCalledWith("/empty");
    expect(mockedRmdir).toHaveBeenCalledWith("/empty");
  });

  it("should not remove non-empty directory", async () => {
    mockedReaddir.mockResolvedValueOnce([
      { name: "file.txt", isDirectory: () => false } as any,
    ]);
    mockedReaddir.mockResolvedValueOnce(["file.txt"]);

    await removeEmptyDirectories("/nonempty");

    expect(mockedRmdir).not.toHaveBeenCalled();
  });

  it("should recurse into subdirectories", async () => {
    const dirEnt = { name: "subdir", isDirectory: () => true };
    mockedReaddir.mockResolvedValueOnce([dirEnt as any]);
    mockedReaddir.mockResolvedValueOnce([]); // for subdir
    mockedReaddir.mockResolvedValueOnce([]); // for root after subdir removed
    mockedRmdir.mockResolvedValue();

    await removeEmptyDirectories("/root");

    expect(mockedReaddir).toHaveBeenCalledWith("/root/subdir", {
      withFileTypes: true,
    });
    expect(mockedRmdir).toHaveBeenCalledWith("/root/subdir");
    expect(mockedRmdir).toHaveBeenCalledWith("/root");
  });
});
