import eslint from "@eslint/js";
import eslintPluginJsonSchemaValidator from "eslint-plugin-json-schema-validator";
import eslintPluginJsonc from "eslint-plugin-jsonc";
// @ts-expect-error eslint-config-prettier has no types
import eslintConfigPrettier from "eslint-config-prettier";
import { type Config } from "eslint/config";
import tseslint from "typescript-eslint";
import markdown from "@eslint/markdown";
// eslint-disable-next-line no-restricted-syntax
import * as eslintPluginMdx from "eslint-plugin-mdx";
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

export const markdownConf: Config[] = [
  {
    files: ["**/*.md"],
    plugins: {
      markdown: markdown as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    },
    language: "markdown/commonmark",
    rules: {
      "markdown/no-html": "error",
      "no-irregular-whitespace": "off",
      "no-trailing-spaces": "off",
      "eol-last": "off",
    },
  },
];

export const mdxConf: Config[] = [
  {
    ...eslintPluginMdx.configs.flat,
    files: ["**/*.mdx"],
  },
];
