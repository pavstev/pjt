import { getJestProjectsAsync } from "@nx/jest";
import type { Config } from "jest";

export default async (): Promise<Config> => ({
  projects: [
    // Automatically include all Nx project Jest configs
    ...(await getJestProjectsAsync()),

    // E2E tests for Astro
    {
      displayName: "e2e-astro",
      preset: "../../jest.preset.js",
      globals: {},
      testEnvironment: "node",
      transform: {
        "^.+\\.[tj]s?$": [
          "ts-jest",
          {
            tsconfig: "<rootDir>/tsconfig.spec.json",
          },
        ],
      },
      moduleFileExtensions: [
        "ts",
        "js",
        "html",
      ],
      coverageDirectory: "../../coverage/e2e/astro",
    },

    // Unit tests for Astro packages
    {
      displayName: "astro",
      preset: "../../jest.preset.js",
      globals: {},
      testEnvironment: "node",
      transform: {
        "^.+\\.[tj]sx?$": [
          "ts-jest",
          {
            tsconfig: "<rootDir>/tsconfig.spec.json",
          },
        ],
      },
      moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
        "jsx",
      ],
      coverageDirectory: "../../coverage/packages/astro",
    },
  ],
});
