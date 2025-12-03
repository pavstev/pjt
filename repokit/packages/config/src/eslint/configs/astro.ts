import { configs as astroConfigs } from "eslint-plugin-astro";

import { type EslintEntry } from "../constants";

export const astro: EslintEntry[] = [
  {
    ...astroConfigs.recommended,
    files: ["**/*.astro"],
  },
  {
    files: ["**/*.astro"],
    rules: {
      // "astro/no-set-html-directive": "error"
    },
  },
];
