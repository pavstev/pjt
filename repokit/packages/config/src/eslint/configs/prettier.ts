import prettierPlugin from "eslint-plugin-prettier/recommended";

import prettierConfig from "../../prettier.config";
import { type EslintEntry, patterns } from "../constants";

export const prettierConfigModule: EslintEntry[] = [
  prettierPlugin,
  {
    extends: [],
    files: patterns.all,
    rules: {
      "prettier/prettier": [
        "error",
        prettierConfig,
      ],
    },
  },
];
