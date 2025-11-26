import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import { type Config } from "eslint/config";
import tseslint from "typescript-eslint";

import { tsFiles } from "./constants";

export const recommended = eslint.configs.recommended as Config;

export const tsRecommended: Config[] = tseslint.configs.recommended.map(
  config => ({
    ...config,
    files: tsFiles,
  }),
);

export const prettierConf: Config = eslintConfigPrettier;
