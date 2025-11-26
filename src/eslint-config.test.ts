import { describe, it, expect } from "vitest";
import {
  eslintConfig,
  recommended,
  jsonc,
  jsonSchema,
  prettierConf,
  tsRecommended,
  prettierPlugin,
  tsRules,
  getIgnores,
} from "./eslint-config.js";

describe("eslint-config", () => {
  it("should export recommended config", () => {
    expect(recommended).toBeDefined();
    expect(typeof recommended).toBe("object");
  });

  it("should export jsonc config", () => {
    expect(jsonc).toBeDefined();
    expect(Array.isArray(jsonc)).toBe(true);
  });

  it("should export jsonSchema config", () => {
    expect(jsonSchema).toBeDefined();
    expect(Array.isArray(jsonSchema)).toBe(true);
  });

  it("should export prettierConf config", () => {
    expect(prettierConf).toBeDefined();
    expect(typeof prettierConf).toBe("object");
  });

  it("should export tsRecommended config", () => {
    expect(tsRecommended).toBeDefined();
    expect(Array.isArray(tsRecommended)).toBe(true);
  });

  it("should export prettierPlugin config", () => {
    expect(prettierPlugin).toBeDefined();
    expect(typeof prettierPlugin).toBe("object");
    expect(prettierPlugin.files).toEqual(["**/*"]);
  });

  it("should export tsRules config", () => {
    expect(tsRules).toBeDefined();
    expect(typeof tsRules).toBe("object");
    expect(tsRules.files).toEqual(["**/*.ts", "**/*.tsx"]);
  });

  it("should export eslintConfig function", () => {
    expect(eslintConfig).toBeDefined();
    expect(typeof eslintConfig).toBe("function");
  });

  it("should call eslintConfig and return config array", async () => {
    const config = await eslintConfig();
    expect(Array.isArray(config)).toBe(true);
    expect(config.length).toBeGreaterThan(0);
  });

  it("should call getIgnores and return ignores object", async () => {
    const ignores = await getIgnores();
    expect(ignores).toBeDefined();
    expect(typeof ignores).toBe("object");
    expect(ignores.ignores).toBeDefined();
    expect(Array.isArray(ignores.ignores)).toBe(true);
  });
});
