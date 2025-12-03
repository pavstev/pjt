/* eslint-disable sonarjs/no-duplicate-string */
import base from "@nx/eslint-plugin";

import { type EslintEntry, tsFiles } from "../constants";

export const nx: EslintEntry[] = [
  base.configs["flat/base"],
  base.configs["flat/typescript"] as EslintEntry[],
  base.configs["flat/javascript"] as EslintEntry[],
  {
    files: tsFiles,
    ignores: [
      "**/eslint.config.ts",
      "**/vitest.config.ts",
    ],
    rules: {
      "@nx/enforce-module-boundaries": [
        "error",
        {
          allow: ["^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$"],
          depConstraints: [
            {
              sourceTag: "scope:vite-app",
            },
            {
              onlyDependOnLibsWithTags: [
                "scope:node",
                "scope:universal",
              ],
              sourceTag: "scope:plugin",
            },
            {
              onlyDependOnLibsWithTags: [
                "scope:node",
                "scope:universal",
              ],
              sourceTag: "scope:node",
            },
            {
              onlyDependOnLibsWithTags: ["scope:universal"],
              sourceTag: "scope:universal",
            },
          ],
          enforceBuildableLibDependency: true,
        },
      ],
    },
  },
];
