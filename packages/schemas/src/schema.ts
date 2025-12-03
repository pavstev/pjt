import { z } from "zod";

export const PluginConditionSchema = z.enum(["always", "git-tracked", "never"]);

const PrettierOptionsSchema = z
  .object({
    arrowParens: z.enum(["always", "avoid"]).optional(),
    bracketSameLine: z.boolean().optional(),
    bracketSpacing: z.boolean().optional(),
    embeddedLanguageFormatting: z.enum(["auto", "off"]).optional(),
    endOfLine: z.enum(["lf", "crlf", "cr", "auto"]).optional(),
    experimentalOperatorPosition: z.enum(["start", "end"]).optional(),
    experimentalTernaries: z.boolean().optional(),
    jsxSingleQuote: z.boolean().optional(),
    parser: z.string().optional(),
    printWidth: z.number().int().min(0).optional(),
    quoteProps: z.enum(["as-needed", "consistent", "preserve"]).optional(),
    semi: z.boolean().optional(),
    singleAttributePerLine: z.boolean().optional(),
    singleQuote: z.boolean().optional(),
    tabWidth: z.number().int().min(0).optional(),
    trailingComma: z.enum(["all", "es5", "none"]).optional(),
    useTabs: z.boolean().optional(),
  })
  .catchall(z.any());

const ConfigOverrideOptionsSchema = PrettierOptionsSchema;

export const ConfigOverridesSchema = z
  .object({
    excludeFiles: z.array(z.string().min(1)).optional(),
    files: z.array(z.string().min(1)),
    options: ConfigOverrideOptionsSchema,
  })
  .strict();

export const PluginDefinitionSchema = z
  .object({
    condition: PluginConditionSchema,
    description: z.string().min(1).optional(),
    filePatterns: z.array(z.string().min(1)).optional(),
    overrides: z.array(ConfigOverridesSchema).optional(),
  })
  .strict();

export const PluginDefinitionsSchema = z.object({
  $schema: z.string(),
  plugins: z.record(z.string(), PluginConditionSchema),
});

export type BaseConfigOptions = {
  overrides?: ConfigOverrides[];
  pluginDefinitions?: PluginDefinition[];
  plugins: string[];
};
export type BuildOptions = {
  destinationPackageJsonPath: string;
  destinationPrettierrcPath: string;
  rootPrettierrcPath: string;
  sourcePackageJsonPath: string;
};
export type ConfigOverrideOptions = z.infer<typeof ConfigOverrideOptionsSchema>;
export type ConfigOverrides = z.infer<typeof ConfigOverridesSchema>;
export type PluginCondition = z.infer<typeof PluginConditionSchema>;

export type PluginDefinition = z.infer<typeof PluginDefinitionSchema>;

export type PluginDefinitions = z.infer<typeof PluginDefinitionsSchema>;

export type PluginRegistry = {
  getInstalledPlugins(packageJsonPath: string): Promise<string[]>;
  getPluginDefinitions(): PluginDefinition[];
  getRequiredPlugins(): Promise<string[]>;
  plugins: Record<string, PluginDefinition>;
};
