import { describe, it, expect } from "vitest";
import { promises as fs } from "fs";

describe("Project analysis", () => {
  it("should have package.json with pjt bin", async () => {
    const packageJson = await fs.readFile("package.json", "utf-8");
    const pkg = JSON.parse(packageJson);
    expect(pkg.bin.pjt).toBe("./dist/bin/pjt.js");
  });
});
