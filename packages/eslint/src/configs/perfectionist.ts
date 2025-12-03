import perfectionist from "eslint-plugin-perfectionist";

import { type EslintEntry } from "../constants";

export const perfectionistConfig: EslintEntry[] = [
  {
    ...perfectionist.configs["recommended-natural"],
    files: ["**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}"],
    rules: {
      "perfectionist/sort-exports": [
        "error",
        {
          type: "natural",
          order: "asc",
          customGroups: [
            {
              groupName: "relative",
              anyOf: [{ elementNamePattern: "^\\./" }],
            },
            {
              groupName: "external",
              anyOf: [{ elementNamePattern: ".*" }],
            },
          ],
          groups: ["relative", "external"],
        },
      ],
    },
  },
];
