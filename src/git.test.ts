import { describe, it, expect, vi } from "vitest";
import { gitClean } from "./git.js";

vi.mock("./utils.js", () => ({
  execPromise: vi.fn(),
}));

import { execPromise } from "./utils.js";

const mockedExecPromise = vi.mocked(execPromise);

describe("gitClean", () => {
  it("should call execPromise with git clean -Xfd and excludes", async () => {
    mockedExecPromise.mockResolvedValue();

    await gitClean([".env.local"]);

    expect(mockedExecPromise).toHaveBeenCalledWith(
      "git clean -Xfd -e .env.local",
    );
  });

  it("should call execPromise with git clean -Xfd with default excludes", async () => {
    mockedExecPromise.mockResolvedValue();

    await gitClean();

    expect(mockedExecPromise).toHaveBeenCalledWith(
      "git clean -Xfd -e .env.local",
    );
  });
});
