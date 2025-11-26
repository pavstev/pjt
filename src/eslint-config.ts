import eslint from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import eslintPluginJsonSchemaValidator from "eslint-plugin-json-schema-validator";
import eslintPluginJsonc from "eslint-plugin-jsonc";
import prettier from "eslint-plugin-prettier";
import { type Config } from "eslint/config";
import tseslint from "typescript-eslint";
import { getIgnorePatterns } from "./utils";

const tsFiles = ["**/*.ts", "**/*.tsx"];

export const getIgnores = async () => ({
  ignores: [
    "dist/",
    "node_modules/",
    "**/*.test.ts",
    ...(await getIgnorePatterns()),
  ],
});

export const recommended: Config = eslint.configs.recommended;

export const jsonc: Config[] =
  eslintPluginJsonc.configs["flat/recommended-with-jsonc"];

export const jsonSchema: Config[] =
  eslintPluginJsonSchemaValidator.configs["flat/recommended"];

export const prettierConf: Config = prettierConfig;

export const tsRecommended: Config[] = tseslint.configs.recommended.map(
  config => ({
    ...config,
    files: tsFiles,
  }),
);

export const prettierPlugin: Config = {
  files: ["**/*"],
  plugins: {
    prettier,
  },
  rules: {
    "prettier/prettier": ["error"],
  },
};

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

export default async (): Promise<Config[]> => {
  const ignores = await getIgnores();
  return [
    ignores,
    recommended,
    ...jsonc,
    ...jsonSchema,
    prettierConf,
    ...tsRecommended,
    prettierPlugin,
    tsRules,
  ];
};
