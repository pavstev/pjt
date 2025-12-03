import type {
  PluginDefinition,
  PluginDefinitions,
  PluginRegistry,
} from "@pjt/schemas";

import { checkGitTrackedFiles, objectEntries } from "@pjt/core";
import { readPackageUp } from "read-package-up";

import * as _plugins from "../schema/prettier-plugins.json";

const plugins = _plugins as PluginDefinitions;

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
    Object.values(plugins) as PluginDefinition[],

  getRequiredPlugins: async (): Promise<string[]> => {
    const requiredPlugins: string[] = [];

    const shouldInstallPlugin = async (
      name: string,
      plugin: PluginDefinition,
    ): Promise<boolean> => {
      if (plugin.condition === "always") return true;

      if (plugin.condition === "never") return false;

      if (plugin.filePatterns) {
        return await checkGitTrackedFiles(plugin.filePatterns);
      }

      return false;
    };

    for (const [name, plugin] of objectEntries(plugins)) {
      if (await shouldInstallPlugin(name, plugin)) {
        requiredPlugins.push(name);
      }
    }

    return requiredPlugins;
  },

  plugins,
});
