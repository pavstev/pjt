import { describe, it, expect } from "vitest";
import type { Command, PackageManager, GitCleanOptions } from "./index.js";

describe("Types", () => {
  it("should define Command type", () => {
    const command: Command = {
      name: "test",
      description: "Test command",
      handler: () => {},
    };
    expect(command.name).toBe("test");
    expect(command.description).toBe("Test command");
    expect(typeof command.handler).toBe("function");
  });

  it("should define PackageManager type", () => {
    const pm: PackageManager = {
      name: "pnpm",
      installCommand: "pnpm install",
      lockFile: "pnpm-lock.yaml",
    };
    expect(pm.name).toBe("pnpm");
    expect(pm.installCommand).toBe("pnpm install");
    expect(pm.lockFile).toBe("pnpm-lock.yaml");
  });

  it("should define GitCleanOptions type", () => {
    const options: GitCleanOptions = {
      exclude: [".env"],
      dryRun: true,
    };
    expect(options.exclude).toEqual([".env"]);
    expect(options.dryRun).toBe(true);
  });
});
