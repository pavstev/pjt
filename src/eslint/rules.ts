import { type Config } from "eslint/config";
import tseslint from "typescript-eslint";

const tsFiles = ["**/*.ts", "**/*.tsx"];

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
    "@typescript-eslint/no-unused-vars": [
      "error",
      { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
    ],
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
};
