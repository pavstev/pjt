import eslint from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import eslintPluginJsonSchemaValidator from "eslint-plugin-json-schema-validator";
import eslintPluginJsonc from "eslint-plugin-jsonc";
import prettier from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";
import { getIgnorePatterns } from "./src/utils";
import tseslint from "typescript-eslint";

const tsFiles = ["**/*.ts", "**/*.tsx"];

const config = defineConfig([
  {
    ignores: [
      "dist/",
      "node_modules/",
      "**/*.test.ts",
      ...(await getIgnorePatterns()),
    ],
  },
  eslint.configs.recommended,
  ...eslintPluginJsonc.configs["flat/recommended-with-jsonc"],
  ...eslintPluginJsonSchemaValidator.configs["flat/recommended"],
  prettierConfig,
  ...tseslint.configs.recommended.map(config => ({
    ...config,
    files: tsFiles,
  })),
  {
    files: ["**/*"],
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
  {
    files: tsFiles,
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: {
          allowDefaultProject: ["vitest.config.ts", "prettier.config.ts"],
        },
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "fs",
              message: "Import from 'node:fs' instead",
            },
            {
              name: "path",
              message: "Import from 'node:path' instead",
            },
            {
              name: "child_process",
              message: "Import from 'node:child_process' instead",
            },
          ],
        },
      ],
      "arrow-body-style": ["error", "as-needed"],
      "func-style": ["error", "expression"],
      "no-else-return": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector: "SwitchStatement",
          message: "Switch statements are not allowed",
        },
        {
          selector: "TSInterfaceDeclaration",
          message: "Use type aliases instead of interfaces",
        },
        {
          selector: "ImportNamespaceSpecifier",
          message: "Use explicit imports instead of 'import * as'",
        },
      ],
    },
  },
]);

export default config;
