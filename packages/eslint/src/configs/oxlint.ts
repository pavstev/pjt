import oxlint from "eslint-plugin-oxlint";

import { type EslintEntry } from "../constants";

export const oxlintConfig: EslintEntry[] = oxlint.configs[
  "flat/recommended"
] as EslintEntry[];
