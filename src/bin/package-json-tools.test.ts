import { describe, it, expect, vi } from "vitest";

// Mock the index module
vi.mock("../index.js", () => ({
  gitCleanCommand: vi.fn(),
}));

import { gitCleanCommand } from "../index.js";
import { packageJsonTools } from "./package-json-tools.js";

const mockedGitCleanCommand = vi.mocked(gitCleanCommand);

describe("packageJsonTools function", () => {
  it("should call gitCleanCommand", async () => {
    mockedGitCleanCommand.mockResolvedValue();

    await packageJsonTools();

    expect(mockedGitCleanCommand).toHaveBeenCalled();
  });
});
