import nxPlugin from "@nx/eslint-plugin";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      "**/dist/",
      "**/build/",
      "**/out/",
      ".nx/",
      "node_modules/",
      "**/package.json",
      ".git/",
      "**/*.d.ts",
    ],
  },
  ...(nxPlugin.configs["flat/base"] as any),
  ...(nxPlugin.configs["flat/typescript"] as any),
  ...(nxPlugin.configs["flat/javascript"] as any),
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    languageOptions: {
      parser: tsparser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
]);
