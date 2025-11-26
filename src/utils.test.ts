import { describe, it, expect, vi } from "vitest";
import { execPromise } from "./utils.js";

vi.mock("node:child_process", () => ({
  exec: vi.fn(),
}));

import { exec } from "node:child_process";

const mockedExec = vi.mocked(exec);

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
