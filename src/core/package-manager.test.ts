import { describe, it, expect, vi } from "vitest";
import { pnpmInstall } from "./package-manager.js";

vi.mock("./utils.js", () => ({
  execPromise: vi.fn(),
}));

vi.mock("./logger.js", () => ({
  logger: {
    info: vi.fn(),
  },
}));

import { execPromise } from "./utils.js";

describe("pnpmInstall", () => {
  it("should call execPromise with pnpm i", async () => {
    const mockExec = vi.mocked(execPromise);
    mockExec.mockResolvedValue(undefined);

    await pnpmInstall();

    expect(mockExec).toHaveBeenCalledWith("pnpm i");
  });

  it("should throw PackageManagerError when execPromise fails", async () => {
    const mockExec = vi.mocked(execPromise);
    mockExec.mockRejectedValue(new Error("Command execution failed"));

    await expect(pnpmInstall()).rejects.toThrow("Package installation failed");
  });

  it("should rethrow non-execution errors", async () => {
    const mockExec = vi.mocked(execPromise);
    const originalError = new Error("Some other error");
    mockExec.mockRejectedValue(originalError);

    await expect(pnpmInstall()).rejects.toThrow(originalError);
  });
});
