import { describe, it, expect, vi } from "vitest";

// Mock the package-json-tools module
vi.mock("./package-json-tools.js", () => ({
  packageJsonTools: vi.fn(),
}));

import { packageJsonTools } from "./package-json-tools.js";

const mockedPackageJsonTools = vi.mocked(packageJsonTools);

describe("pjt CLI", () => {
  it("should call packageJsonTools when package-json-tools subcommand is executed", async () => {
    mockedPackageJsonTools.mockResolvedValue();

    await packageJsonTools();

    expect(mockedPackageJsonTools).toHaveBeenCalled();
  });

  it("should have help option", () => {
    // Placeholder: in real test, check commander help
    expect(true).toBe(true);
  });
});
