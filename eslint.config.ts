import eslint from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import eslintPluginJsonSchemaValidator from "eslint-plugin-json-schema-validator";
import eslintPluginJsonc from "eslint-plugin-jsonc";
import prettier from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";
import { globifyGitIgnore } from "globify-gitignore";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import tseslint from "typescript-eslint";

const getIgnorePatterns = async (): Promise<string[]> => {
  const directory = import.meta.dirname;
  const entries = await Promise.all(
    readdirSync(".", {
      encoding: "utf8",
      recursive: false,
    })
      .filter((file: string) => /^\..(\w+)ignore$/.test(file))
      .map(async (file: string) => {
        const entries = await globifyGitIgnore(
          join(directory, file),
          directory,
          true,
        );

        return entries.filter(e => e.included).map(e => e.glob);
      }),
  );

  return entries.flat();
};

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
          allowDefaultProject: [
            "eslint.config.ts",
            "knip.config.ts",
            "vitest.config.ts",
          ],
        },
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
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
