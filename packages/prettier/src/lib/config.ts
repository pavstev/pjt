import type { Config } from "prettier";
import type {
  BaseConfigOptions,
  ConfigOverrides,
  PluginDefinition,
} from "../schema/schema";
import { deduplicateOverrides } from "./utils";

export const createBaseConfig = (options: BaseConfigOptions): Config => {
  const { plugins, pluginDefinitions = [], overrides = [] } = options;

  const pluginOverrides = pluginDefinitions
    .filter(
      (plugin): plugin is PluginDefinition & { overrides: ConfigOverrides[] } =>
        Boolean(plugin.overrides),
    )
    .flatMap(plugin => plugin.overrides);

  const uniqueOverrides = deduplicateOverrides([
    ...pluginOverrides,
    ...overrides,
  ]);

  return {
    plugins,
    arrowParens: "avoid",
    bracketSameLine: false,
    bracketSpacing: true,
    embeddedLanguageFormatting: "auto",
    endOfLine: "lf",
    htmlWhitespaceSensitivity: "css",
    insertPragma: false,
    jsxSingleQuote: false,
    overrides: uniqueOverrides,
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
