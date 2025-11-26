import { describe, it, expect, vi } from "vitest";
import { gitClean } from "./git.js";

vi.mock("./utils.js", () => ({
  execPromise: vi.fn(),
  validateGitCleanOptions: vi.fn(),
}));

vi.mock("./logger.js", () => ({
  logger: {
    info: vi.fn(),
  },
}));

import { execPromise, validateGitCleanOptions } from "./utils.js";

describe("gitClean", () => {
  it("should call execPromise with correct command", async () => {
    const mockExec = vi.mocked(execPromise);
    const mockValidate = vi.mocked(validateGitCleanOptions);
    mockExec.mockResolvedValue(undefined);
    mockValidate.mockImplementation(() => {});

    await gitClean();

    expect(mockValidate).toHaveBeenCalledWith({});
    expect(mockExec).toHaveBeenCalledWith("git clean -Xfd -e .env.local");
  });

  it("should call execPromise with custom exclude", async () => {
    const mockExec = vi.mocked(execPromise);
    const mockValidate = vi.mocked(validateGitCleanOptions);
    mockExec.mockResolvedValue(undefined);
    mockValidate.mockImplementation(() => {});

    await gitClean({ exclude: ["custom"] });

    expect(mockValidate).toHaveBeenCalledWith({ exclude: ["custom"] });
    expect(mockExec).toHaveBeenCalledWith("git clean -Xfd -e custom");
  });

  it("should include dry-run flag when dryRun is true", async () => {
    const mockExec = vi.mocked(execPromise);
    const mockValidate = vi.mocked(validateGitCleanOptions);
    mockExec.mockResolvedValue(undefined);
    mockValidate.mockImplementation(() => {});

    await gitClean({ dryRun: true });

    expect(mockExec).toHaveBeenCalledWith(
      "git clean -Xfd --dry-run -e .env.local",
    );
  });

  it("should throw GitError when execPromise fails", async () => {
    const mockExec = vi.mocked(execPromise);
    const mockValidate = vi.mocked(validateGitCleanOptions);
    mockExec.mockRejectedValue(new Error("Command execution failed"));
    mockValidate.mockImplementation(() => {});

    await expect(gitClean()).rejects.toThrow("Git clean failed");
  });

  it("should rethrow non-execution errors", async () => {
    const mockExec = vi.mocked(execPromise);
    const mockValidate = vi.mocked(validateGitCleanOptions);
    const originalError = new Error("Some other error");
    mockExec.mockRejectedValue(originalError);
    mockValidate.mockImplementation(() => {});

    await expect(gitClean()).rejects.toThrow(originalError);
  });
});
