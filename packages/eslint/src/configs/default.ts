import { defineConfig } from "eslint/config";
import type { ConfigArray } from "typescript-eslint";

import { getIgnores } from "../ignores";
import { tsRules } from "../rules";
import { prettierConf, recommended, tsRecommended } from "./base";
import { jsonc, jsonSchema } from "./json";
import { markdownConf, mdxConf } from "./markdown";
import { nxDependencyChecks, nxPluginChecks } from "./nx";

export const defaultConfig = async (): Promise<ConfigArray> =>
  defineConfig([
    await getIgnores(),
    recommended,
    ...jsonc,
    ...jsonSchema,
    prettierConf,
    ...tsRecommended,
    tsRules,
    {
      files: ["**/e2e/**/*.ts"],
      rules: {
        "@typescript-eslint/no-confusing-void-expression": "off",
        "@typescript-eslint/prefer-nullish-coalescing": "off",
        "@typescript-eslint/no-unnecessary-condition": "off",
      },
    },
    ...markdownConf,
    ...mdxConf,
    ...nxDependencyChecks,
    ...nxPluginChecks,
  ]);
