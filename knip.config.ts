import type { KnipConfig } from "knip";

const config: KnipConfig = {
  ignore: [
    "packages/nx/package.json",
    "packages/core/package.json",
    "packages/prettier/jest.config.cts",
  ],
  ignoreBinaries: ["tsx"],
  includeEntryExports: false,
  rules: {
    unresolved: "off",
  },
  workspaces: {
    ".": {
      entry: ["eslint.config.ts"],
      project: ["*.ts", "*.js"],
      ignoreDependencies: [
        "@nx/*",
        "jest",
        "jest-environment-*",
        "ts-node",
        "tslib",
        "jsdom",
        "jsonc-eslint-parser",
        "@swc/*",
        "@playwright/test",
        "eslint-plugin-playwright",
        "eslint",
      ],
    },
    "packages/*": {
      entry: ["src/index.ts"],
      project: ["src/**/*.ts"],
    },
    "packages/cli": {
      ignoreDependencies: ["@nx/eslint", "jiti"],
    },
    "packages/docs": {
      entry: ["astro.config.mjs"],
      project: ["src/**/*"],
    },
    "packages/prettier": {
      project: ["src/**/*.ts", "jest.config.cts"],
    },
  },
};

export default config;
