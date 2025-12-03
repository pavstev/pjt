import type { Config } from "prettier";

import { installPackages } from "@pjt/core";
import { dirname, join } from "node:path";
import { readPackageUp } from "read-package-up";

import { createBaseConfig } from "./lib/config";
import { createPluginRegistry } from "./lib/registry";

type Options = {
  cwd: string;
  logger: {
    log: (data: string, ...rest: unknown[]) => void;
  };
  writeFile: (file: string, data: string) => Promise<void>;
};

export const configure = async ({
  cwd,
  logger,
  writeFile,
}: Options): Promise<void> => {
  const pluginRegistry = createPluginRegistry();
  const requiredPlugins = await pluginRegistry.getRequiredPlugins();
  await installPackages(requiredPlugins);

  const packageResult = await readPackageUp({
    cwd,
  });

  if (!packageResult) {
    throw new Error(`No package.json found for cwd: ${cwd}`);
  }

  const installedPlugins = await pluginRegistry.getInstalledPlugins(
    packageResult.path,
  );
  const pluginDefinitions = pluginRegistry.getPluginDefinitions();
  const config = createBaseConfig({
    pluginDefinitions,
    plugins: installedPlugins,
  });

  const prettierConfigPath = join(
    dirname(packageResult.path),
    ".prettierrc.json",
  );
  await writeFile(
    prettierConfigPath,
    JSON.stringify(
      {
        $schema: "https://json.schemastore.org/prettierrc",
        ...config,
      },
      undefined,
      2,
    ),
  );

  logger.log(
    `Prettier config generated successfully with ${installedPlugins.length} plugins!`,
  );
  logger.log("Installed plugins:", installedPlugins);
  logger.log(`Config written to: ${prettierConfigPath}`);
};

export const createConfig = async (
  packageJsonPath: string,
): Promise<Config> => {
  const pluginRegistry = createPluginRegistry();
  const installedPlugins =
    await pluginRegistry.getInstalledPlugins(packageJsonPath);
  const pluginDefinitions = pluginRegistry.getPluginDefinitions();
  return createBaseConfig({
    pluginDefinitions,
    plugins: installedPlugins,
  });
};
