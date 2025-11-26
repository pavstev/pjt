import { describe, it, expect, vi } from "vitest";
import { gitClean } from "./git.js";

vi.mock("./utils.js", () => ({
  execPromise: vi.fn(),
}));

import { execPromise } from "./utils.js";

describe("gitClean", () => {
  it("should call execPromise with correct command", async () => {
    const mockExec = vi.mocked(execPromise);
    mockExec.mockResolvedValue(undefined);

    await gitClean();

    expect(mockExec).toHaveBeenCalledWith("git clean -Xfd -e .env.local");
  });

  it("should call execPromise with custom exclude", async () => {
    const mockExec = vi.mocked(execPromise);
    mockExec.mockResolvedValue(undefined);

    await gitClean(["custom"]);

    expect(mockExec).toHaveBeenCalledWith("git clean -Xfd -e custom");
  });
});
