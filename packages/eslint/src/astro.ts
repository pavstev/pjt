import { configs as astroConfigs } from "eslint-plugin-astro";
import { type Config } from "eslint/config";

export const astro: Config[] = [
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
