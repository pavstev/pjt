import type { Config } from "eslint/config";

import { defineConfig } from "eslint/config";

import { cspellConfig } from "./cspell";
import { globalsConfig } from "./globals";
import { js } from "./js";
import { mdxConfig } from "./mdx";
import { nx } from "./nx";
import { oxlintConfig } from "./oxlint";
import { perfectionistConfig } from "./perfectionist";
import { prettierConfigModule } from "./prettier";
import { schema } from "./schema";
import { source } from "./source";

export const defaultConfig = (): Config[] =>
  defineConfig([
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
    ...globalsConfig,
    ...js,
    ...nx,
    ...schema,
    ...source,
    ...perfectionistConfig,
    ...oxlintConfig,
    ...prettierConfigModule,
    ...mdxConfig,
    ...cspellConfig,
  ]);

export const config = defaultConfig();
