import globals from "globals";

import { type EslintEntry } from "../constants";

export const globalsConfig: EslintEntry[] = [
  {
    languageOptions: {
      globals: globals.node,
    },
  },
];
