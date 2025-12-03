import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import { type Config } from "eslint/config";
import tseslint from "typescript-eslint";

import { tsFiles } from "../constants";

export const recommended: Config = eslint.configs.recommended;

export const tsRecommended: Config[] = tseslint.configs.recommended.map(
  config => ({
    ...config,
    files: tsFiles,
  }),
);

export const prettierConf: Config = eslintConfigPrettier;
