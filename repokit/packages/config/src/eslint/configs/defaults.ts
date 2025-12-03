import { type EslintEntry } from "../constants";
import { astro } from "./astro";
import { cspellConfig } from "./cspell";
import { css } from "./css";
import { globalsConfig } from "./globals";
import { ignores } from "./ignores";
import { js } from "./js";
import { mdxConfig } from "./mdx";
import { nx } from "./nx";
import { oxlintConfig } from "./oxlint";
import { perfectionistConfig } from "./perfectionist";
import { prettierConfigModule } from "./prettier";
import { schema } from "./schema";
import { source } from "./source";
import { vitestConfig } from "./vitest";

export const defaults: EslintEntry[] = [
  ignores,
  globalsConfig,
  js,
  nx,
  schema,
  source,
  css,
  astro,
  perfectionistConfig,
  oxlintConfig,
  prettierConfigModule,
  vitestConfig,
  mdxConfig,
  cspellConfig,
];
