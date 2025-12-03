import { checkGitTrackedFiles, checkJSDocPresence } from "@pjt/core";
import { readPackageUp } from "read-package-up";
import pluginDefinitions from "../schema/prettier-plugins.json";
import type { PluginDefinition, PluginRegistry } from "../schema/schema";

const { $schema: _, ...definitions } = pluginDefinitions;
const validatedDefinitions = definitions as Record<string, PluginDefinition>;

export const createPluginRegistry = async (): Promise<PluginRegistry> => {
  const plugins = validatedDefinitions;

  return {
    plugins,

    async getRequiredPlugins(): Promise<string[]> {
      const requiredPlugins: string[] = [];

      for (const [name, plugin] of Object.entries(plugins)) {
        if (plugin.condition === "always") {
          requiredPlugins.push(name);
        } else if (plugin.condition === "never") {
          // Skip plugins with "never" condition
          continue;
        } else {
          let shouldInstall = false;

          if (name === "prettier-plugin-jsdoc") {
            shouldInstall = await checkJSDocPresence();
          } else if (plugin.filePatterns) {
            shouldInstall = await checkGitTrackedFiles(plugin.filePatterns);
          }

          if (shouldInstall) {
            requiredPlugins.push(name);
          }
        }
      }

      return requiredPlugins;
    },

    async getInstalledPlugins(packageJsonPath: string): Promise<string[]> {
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

    getPluginDefinitions(): PluginDefinition[] {
      return Object.values(plugins);
    },
  };
};
