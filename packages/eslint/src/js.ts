import base from "@eslint/js";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export const js: any = [
  {
    ...base.configs.recommended,
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx,mts,cts}"],
  },
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...tseslint.configs.recommended[0].rules,
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
  prettier,
];
