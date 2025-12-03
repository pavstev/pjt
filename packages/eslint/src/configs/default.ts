import type { Config } from "eslint/config";

import { getIgnorePatterns, Logger } from "@pjt/core";
import { defineConfig } from "eslint/config";

import { astro } from "./astro";
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

export const defaultConfig = async (): Promise<Config[]> =>
  defineConfig([
    {
      ignores: [
        ...(await getIgnorePatterns(new Logger())),
        "dist/",
        "build/",
        "out/",
        ".nx/",
        "node_modules/",
        "**/package.json",
      ],
    },
    ...globalsConfig,
    ...js,
    ...nx,
    ...schema,
    ...source,
    ...astro,
    ...perfectionistConfig,
    ...oxlintConfig,
    ...prettierConfigModule,
    ...mdxConfig,
    ...cspellConfig,
  ]);
