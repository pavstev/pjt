import { describe, it, expect } from "vitest";
import prettierConfig from "./prettier-config.js";

describe("prettier-config", () => {
  it("should export a config object", () => {
    expect(typeof prettierConfig).toBe("object");
    expect(prettierConfig).toHaveProperty("arrowParens", "avoid");
    expect(prettierConfig).toHaveProperty("overrides");
    expect(Array.isArray(prettierConfig.overrides)).toBe(true);
    expect(prettierConfig.overrides.length).toBeGreaterThan(0);
  });
});
