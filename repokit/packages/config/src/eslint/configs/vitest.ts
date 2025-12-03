import vitest from "@vitest/eslint-plugin";

import { type EslintEntry, testFiles } from "../constants";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */
export const vitestConfig: EslintEntry[] = [
  {
    files: testFiles,
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
    plugins: {
      vitest: vitest as any,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      "sonarjs/no-duplicate-string": "off",
    },
    settings: {
      vitest: {
        typecheck: true,
      },
    },
  },
];
/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */
