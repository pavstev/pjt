import eslint from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import eslintPluginJsonSchemaValidator from "eslint-plugin-json-schema-validator";
import eslintPluginJsonc from "eslint-plugin-jsonc";
import { type Config } from "eslint/config";
import tseslint from "typescript-eslint";

export const recommended: Config = eslint.configs.recommended;

export const jsonc: Config[] =
  eslintPluginJsonc.configs["flat/recommended-with-jsonc"];

export const jsonSchema: Config[] =
  eslintPluginJsonSchemaValidator.configs["flat/recommended"];

export const prettierConf: Config = prettierConfig;

const tsFiles = ["**/*.ts", "**/*.tsx"];

export const tsRecommended: Config[] = tseslint.configs.recommended.map(
  config => ({
    ...config,
    files: tsFiles,
  }),
);
