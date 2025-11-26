import { describe, it, expect, vi } from "vitest";
import { gitCleanCommand } from "./index.js";

vi.mock("./fs.js", () => ({
  removeEmptyDirectories: vi.fn(),
}));

vi.mock("./git.js", () => ({
  gitClean: vi.fn(),
}));

vi.mock("./package-manager.js", () => ({
  pnpmInstall: vi.fn(),
}));

import { removeEmptyDirectories } from "./fs.js";
import { gitClean } from "./git.js";
import { pnpmInstall } from "./package-manager.js";

const mockedRemoveEmptyDirectories = vi.mocked(removeEmptyDirectories);
const mockedGitClean = vi.mocked(gitClean);
const mockedPnpmInstall = vi.mocked(pnpmInstall);

describe("gitCleanCommand", () => {
  it("should call removeEmptyDirectories, gitClean, and pnpmInstall", async () => {
    mockedRemoveEmptyDirectories.mockResolvedValue();
    mockedGitClean.mockResolvedValue();
    mockedPnpmInstall.mockResolvedValue();

    await gitCleanCommand();

    expect(mockedRemoveEmptyDirectories).toHaveBeenCalledWith(".");
    expect(mockedGitClean).toHaveBeenCalled();
    expect(mockedPnpmInstall).toHaveBeenCalled();
  });
});
