import { describe, it, expect, vi } from "vitest";
import eslintConfig from "./eslint-config.js";

vi.mock("@eslint/js", () => ({
  default: {
    configs: {
      recommended: { rules: {} },
    },
  },
}));

vi.mock("eslint-config-prettier", () => ({
  default: { rules: {} },
}));

vi.mock("eslint-plugin-json-schema-validator", () => ({
  default: {
    configs: {
      "flat/recommended": [{ rules: {} }],
    },
  },
}));

vi.mock("eslint-plugin-jsonc", () => ({
  default: {
    configs: {
      "flat/recommended-with-jsonc": [{ rules: {} }],
    },
  },
}));

vi.mock("eslint-plugin-prettier", () => ({
  default: { rules: {} },
}));

vi.mock("typescript-eslint", () => ({
  default: {
    configs: {
      recommended: [{ rules: {} }],
    },
    parser: {},
  },
}));

vi.mock("../core/utils.js", () => ({
  getIgnorePatterns: vi.fn(),
}));

import { getIgnorePatterns } from "../core/utils.js";

describe("eslint-config", () => {
  it("should return a config array", async () => {
    const mockGetIgnores = vi.mocked(getIgnorePatterns);
    mockGetIgnores.mockResolvedValue(["*.log"]);

    const config = await eslintConfig();

    expect(Array.isArray(config)).toBe(true);
    expect(config.length).toBeGreaterThan(0);
    expect(config[0]).toHaveProperty("ignores");
  });
});
