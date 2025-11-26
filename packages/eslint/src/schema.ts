import jsonSchemaValidator from "eslint-plugin-json-schema-validator";
import jsonc from "eslint-plugin-jsonc";
import yml from "eslint-plugin-yml";
import jsoncParser from "jsonc-eslint-parser";

import { type EslintEntry, patterns } from "./constants";

const ensureArray = <T>(arrayLike: T | T[]): T[] =>
  Array.isArray(arrayLike) ? arrayLike : [arrayLike];

/* eslint-disable @typescript-eslint/no-explicit-any */
export const schema: EslintEntry[] = [
  ...ensureArray(jsonc.configs["flat/recommended-with-jsonc"]).map(
    (config: any) => ({
      ...config,
      files: patterns.json,
    }),
  ),
  ...ensureArray(jsonSchemaValidator.configs["flat/recommended"]).map(
    (config: any) => ({
      ...config,
      files: patterns.jsonOnly,
    }),
  ),
  ...ensureArray(yml.configs["flat/recommended"]).map((config: any) => ({
    ...config,
    files: patterns.yaml,
  })),
  {
    files: patterns.jsonOnly,
    ignores: ["**/package.json"],
    languageOptions: {
      parser: jsoncParser,
    },
    rules: {
      "@nx/dependency-checks": [
        "error",
        {
          ignoredFiles: ["{projectRoot}/eslint.config.ts"],
        },
      ],
      "json-schema-validator/no-invalid": "error",
    },
  },
];
/* eslint-enable @typescript-eslint/no-explicit-any */
