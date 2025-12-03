import base from "@eslint/js";
import prettier from "eslint-config-prettier";

import type { EslintEntry } from "../constants";

export const js: EslintEntry[] = [
  {
    ...base.configs.recommended,
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx,mts,cts}"],
  },
  prettier,
];
