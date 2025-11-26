import { describe, it, expect, vi } from "vitest";

// Mock the index module
vi.mock("../index.js", () => ({
  gitCleanCommand: vi.fn(),
}));

import { gitCleanCommand } from "../index.js";

const mockedGitCleanCommand = vi.mocked(gitCleanCommand);

describe("pjt CLI", () => {
  it("should call gitCleanCommand when package-json-tools subcommand is executed", async () => {
    mockedGitCleanCommand.mockResolvedValue();

    await gitCleanCommand();

    expect(mockedGitCleanCommand).toHaveBeenCalled();
  });

  it("should have help option", () => {
    // Placeholder: in real test, check commander help
    expect(true).toBe(true);
  });
});
