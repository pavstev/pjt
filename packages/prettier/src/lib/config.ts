import type { BaseConfigOptions, ConfigOverrides } from "@pjt/schemas";
import type { Config } from "prettier";

import { deduplicateOverrides } from "./utils";

export const createBaseConfig = (options: BaseConfigOptions): Config => {
  const { overrides = [], pluginDefinitions = [], plugins } = options;

  const pluginOverrides = pluginDefinitions
    .filter(plugin => plugin.overrides !== null)
    .flatMap(plugin => plugin.overrides as ConfigOverrides[]);

  const uniqueOverrides = deduplicateOverrides([
    ...pluginOverrides,
    ...overrides,
  ]);

  return {
    arrowParens: "avoid",
    bracketSameLine: false,
    bracketSpacing: true,
    embeddedLanguageFormatting: "auto",
    endOfLine: "lf",
    htmlWhitespaceSensitivity: "css",
    insertPragma: false,
    jsxSingleQuote: false,
    overrides: uniqueOverrides,
    plugins,
    printWidth: 80,
    proseWrap: "preserve",
    quoteProps: "consistent",
    requirePragma: false,
    semi: true,
    singleAttributePerLine: false,
    singleQuote: false,
    tabWidth: 2,
    trailingComma: "all",
    useTabs: false,
    vueIndentScriptAndStyle: true,
  };
};
