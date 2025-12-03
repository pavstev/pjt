import jsdoc from "eslint-plugin-jsdoc";
import jsonSchemaValidator from "eslint-plugin-json-schema-validator";
import jsonc from "eslint-plugin-jsonc";
import yml from "eslint-plugin-yml";
import jsoncParser from "jsonc-eslint-parser";

import { type EslintEntry } from "../constants";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */
export const schema: EslintEntry[] = [
  ...(Array.isArray(jsdoc.configs["flat/recommended"])
    ? jsdoc.configs["flat/recommended"]
    : [jsdoc.configs["flat/recommended"]]
  ).map((config: any) => ({
    ...config,
    files: ["**/*.{js,ts,jsx,tsx,mjs,cjs,mts,cts}"],
  })),
  ...(Array.isArray(jsonc.configs["flat/recommended-with-jsonc"])
    ? jsonc.configs["flat/recommended-with-jsonc"]
    : [jsonc.configs["flat/recommended-with-jsonc"]]
  ).map((config: any) => ({
    ...config,
    files: ["**/*.{json,jsonc,json5}"],
  })),
  ...(Array.isArray(jsonSchemaValidator.configs["flat/recommended"])
    ? jsonSchemaValidator.configs["flat/recommended"]
    : [jsonSchemaValidator.configs["flat/recommended"]]
  ).map((config: any) => ({
    ...config,
    files: ["**/*.json"],
  })),
  ...(Array.isArray(yml.configs["flat/recommended"])
    ? yml.configs["flat/recommended"]
    : [yml.configs["flat/recommended"]]
  ).map((config: any) => ({
    ...config,
    files: ["**/*.{yml,yaml}"],
  })),
  {
    files: ["**/*.json"],
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
/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */
