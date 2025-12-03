import { z } from "zod";

export const PluginConditionSchema = z.enum(["always", "git-tracked", "never"]);

const ConfigOverrideOptionsSchema = z.record(z.string(), z.unknown());

export const ConfigOverridesSchema = z.object({
  files: z.array(z.string()),
  excludeFiles: z.array(z.string()).optional(),
  options: ConfigOverrideOptionsSchema,
});

export const PluginDefinitionSchema = z.object({
  condition: PluginConditionSchema,
  filePatterns: z.array(z.string()).optional(),
  description: z.string().optional(),
  overrides: z.array(ConfigOverridesSchema).optional(),
});

export const PluginDefinitionsSchema = z.partialRecord(
  z.string(),
  PluginDefinitionSchema,
);

export type PluginCondition = z.infer<typeof PluginConditionSchema>;
export type ConfigOverrides = z.infer<typeof ConfigOverridesSchema>;
export type ConfigOverrideOptions = z.infer<typeof ConfigOverrideOptionsSchema>;
export type PluginDefinition = z.infer<typeof PluginDefinitionSchema>;
export type PluginDefinitions = z.infer<typeof PluginDefinitionsSchema>;

export type PluginRegistry = {
  plugins: Record<string, PluginDefinition>;
  getRequiredPlugins(): Promise<string[]>;
  getInstalledPlugins(packageJsonPath: string): Promise<string[]>;
  getPluginDefinitions(): PluginDefinition[];
};

export type BaseConfigOptions = {
  plugins: string[];
  pluginDefinitions?: PluginDefinition[];
  overrides?: ConfigOverrides[];
};

export type BuildOptions = {
  sourcePackageJsonPath: string;
  destinationPackageJsonPath: string;
  destinationPrettierrcPath: string;
  rootPrettierrcPath: string;
};
