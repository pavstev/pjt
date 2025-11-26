import { describe, it, expect, vi } from "vitest";
import { pnpmInstall } from "./package-manager.js";

vi.mock("./utils.js", () => ({
  execPromise: vi.fn(),
}));

import { execPromise } from "./utils.js";

const mockedExecPromise = vi.mocked(execPromise);

describe("pnpmInstall", () => {
  it("should call execPromise with pnpm i", async () => {
    mockedExecPromise.mockResolvedValue();

    await pnpmInstall();

    expect(mockedExecPromise).toHaveBeenCalledWith("pnpm i");
  });
});
