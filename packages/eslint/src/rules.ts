import { type Config } from "eslint/config";
import tseslint from "typescript-eslint";

import { tsFiles } from "./constants";

export const tsRules: Config = {
  files: tsFiles,
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.ts"],
      },
    },
  },
  rules: {
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-confusing-void-expression": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-inferrable-types": "error",
    "@typescript-eslint/no-restricted-imports": [
      "error",
      {
        paths: [
          {
            message: "Import from 'node:fs' instead",
            name: "fs",
          },
          {
            message: "Import from 'node:path' instead",
            name: "path",
          },
          {
            message: "Import from 'node:child_process' instead",
            name: "child_process",
          },
        ],
      },
    ],
    "@typescript-eslint/no-unnecessary-condition": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "arrow-body-style": ["error", "as-needed"],
    "func-style": ["error", "expression"],
    "no-else-return": "error",
    "no-restricted-syntax": [
      "error",
      {
        message: "Switch statements are not allowed",
        selector: "SwitchStatement",
      },
      {
        message: "Use type aliases instead of interfaces",
        selector: "TSInterfaceDeclaration",
      },
      {
        message: "Use explicit imports instead of 'import * as'",
        selector: "ImportNamespaceSpecifier",
      },
    ],
  },
};
