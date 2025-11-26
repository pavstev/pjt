import { readPackageUp } from "read-package-up";
import { checkGitTrackedFiles } from "../../git";
import { objectEntries } from "../utils";

import * as _plugins from "./prettier-plugins.json";

export type PluginDefinition = {
  condition: "always" | "never" | "git-tracked";
  description?: string;
  filePatterns?: string[];
  overrides?:
    | {
        files: string[];
        excludeFiles?: string[];
        options: Record<string, unknown>;
      }[]
    | null;
};

export type PluginDefinitions = {
  plugins: Record<string, PluginDefinition>;
};

export type PluginRegistry = {
  getInstalledPlugins: (packageJsonPath: string) => Promise<string[]>;
  getPluginDefinitions: () => PluginDefinition[];
  getRequiredPlugins: () => Promise<string[]>;
  plugins: Record<string, PluginDefinition>;
};

const pluginDefinitions = _plugins as unknown as PluginDefinitions;
const { plugins } = pluginDefinitions;

const shouldInstallPlugin = async (
  plugin: PluginDefinition,
): Promise<boolean> => {
  if (plugin.condition === "always") return true;

  if (plugin.condition === "never") return false;

  if (plugin.filePatterns) {
    return await checkGitTrackedFiles(plugin.filePatterns);
  }

  return false;
};

export const createPluginRegistry = (): PluginRegistry => ({
  getInstalledPlugins: async (packageJsonPath: string): Promise<string[]> => {
    const result = await readPackageUp({ cwd: packageJsonPath });
    if (!result) {
      return [];
    }

    const { packageJson } = result;

    return Object.entries(plugins)
      .filter(
        ([name]) =>
          packageJson.devDependencies?.[name] ??
          packageJson.dependencies?.[name],
      )
      .map(([name]) => name);
  },

  getPluginDefinitions: (): PluginDefinition[] =>
    Object.values(plugins).filter(
      (plugin): plugin is PluginDefinition =>
        plugin !== null && typeof plugin === "object" && "condition" in plugin,
    ),

  getRequiredPlugins: async (): Promise<string[]> => {
    const requiredPlugins: string[] = [];

    for (const [name, plugin] of objectEntries(plugins)) {
      if (await shouldInstallPlugin(plugin)) {
        requiredPlugins.push(name);
      }
    }

    return requiredPlugins;
  },

  plugins,
});
