import base from "@eslint/css";
import { tailwind4 } from "tailwind-csstree";

import { type EslintEntry } from "../constants";

export const css: EslintEntry[] = [
  {
    extends: ["css/recommended"],
    files: ["**/*.css"],
    ignores: [
      "**/dist/**",
      "**/build/**",
      "**/.astro/**",
    ],
    language: "css/css",
    languageOptions: {
      customSyntax: tailwind4,
    },
    plugins: { css: base },
    rules: {
      "css/no-empty-blocks": "error",
      "css/no-invalid-at-rules": "off",
    },
  },
];
