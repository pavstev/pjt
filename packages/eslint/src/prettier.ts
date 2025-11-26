import prettierPlugin from "eslint-plugin-prettier/recommended";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { type EslintEntry, patterns } from "./constants";

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const prettierConfig = require(join(__dirname, "../../../.prettierrc.json"));

export const prettierConfigModule: EslintEntry[] = [
  prettierPlugin,
  {
    extends: [],
    files: patterns.all,
    rules: {
      "prettier/prettier": ["error", prettierConfig],
    },
  },
];
