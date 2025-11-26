import { describe, it, expect, vi } from "vitest";
import { gitCleanCommand } from "./index.js";

vi.mock("./core/fs.js", () => ({
  removeEmptyDirectories: vi.fn(),
}));

vi.mock("./core/git.js", () => ({
  gitClean: vi.fn(),
}));

vi.mock("./core/package-manager.js", () => ({
  pnpmInstall: vi.fn(),
}));

vi.mock("./bin/cli-utils.js", () => ({
  checkGitRepository: vi.fn(),
  handleError: vi.fn(),
}));

import { removeEmptyDirectories } from "./core/fs.js";
import { gitClean } from "./core/git.js";
import { pnpmInstall } from "./core/package-manager.js";
import { checkGitRepository, handleError } from "./bin/cli-utils.js";

describe("gitCleanCommand", () => {
  it("should execute all operations successfully", async () => {
    const mockCheckGit = vi.mocked(checkGitRepository);
    const mockRemoveEmpty = vi.mocked(removeEmptyDirectories);
    const mockGitClean = vi.mocked(gitClean);
    const mockPnpmInstall = vi.mocked(pnpmInstall);

    mockCheckGit.mockResolvedValue(undefined);
    mockRemoveEmpty.mockResolvedValue(undefined);
    mockGitClean.mockResolvedValue(undefined);
    mockPnpmInstall.mockResolvedValue(undefined);

    await gitCleanCommand();

    expect(mockCheckGit).toHaveBeenCalled();
    expect(mockRemoveEmpty).toHaveBeenCalledWith(".");
    expect(mockGitClean).toHaveBeenCalled();
    expect(mockPnpmInstall).toHaveBeenCalled();
  });

  it("should call handleError when an error occurs", async () => {
    const mockCheckGit = vi.mocked(checkGitRepository);
    const mockHandleError = vi.mocked(handleError);
    const error = new Error("Test error");

    mockCheckGit.mockRejectedValue(error);

    await gitCleanCommand();

    expect(mockHandleError).toHaveBeenCalledWith(error);
  });
});
