import { type Config } from "eslint/config";
import globals from "globals";

export const globalsConfig: Config[] = [
  {
    languageOptions: {
      globals: globals.node,
    },
  },
];
