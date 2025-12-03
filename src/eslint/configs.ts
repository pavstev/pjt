import eslint from "@eslint/js";
import eslintPluginJsonSchemaValidator from "eslint-plugin-json-schema-validator";
import eslintPluginJsonc from "eslint-plugin-jsonc";
import eslintConfigPrettier from "eslint-config-prettier";
import { type Config } from "eslint/config";
import tseslint from "typescript-eslint";
import { tsFiles } from "./constants";

export const recommended: Config = eslint.configs.recommended;

export const jsonc: Config[] =
  eslintPluginJsonc.configs["flat/recommended-with-jsonc"];

export const jsonSchema: Config[] =
  eslintPluginJsonSchemaValidator.configs["flat/recommended"];

export const tsRecommended: Config[] = tseslint.configs.recommended.map(
  config => ({
    ...config,
    files: tsFiles,
  }),
);

export const prettierConf: Config = eslintConfigPrettier;
