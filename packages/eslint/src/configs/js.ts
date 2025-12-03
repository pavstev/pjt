import base from "@eslint/js";
import prettier from "eslint-config-prettier";
import { type Config } from "eslint/config";

export const js: Config[] = [
  {
    ...base.configs.recommended,
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx,mts,cts}"],
  },
  prettier,
];
