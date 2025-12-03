import { dirname, join } from "node:path";
import type { Config } from "prettier";
import { readPackageUp } from "read-package-up";

import { installPackages } from "@pjt/core";
import { createBaseConfig } from "./lib/config";
import { createPluginRegistry } from "./lib/registry";

type Options = {
  cwd: string;
  writeFile: (file: string, data: string) => Promise<void>;
  logger: {
    log: (data: string, ...rest: unknown[]) => void;
  };
};

export const configure = async ({
  cwd,
  writeFile,
  logger,
}: Options): Promise<void> => {
  const pluginRegistry = await createPluginRegistry();
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
    plugins: installedPlugins,
    pluginDefinitions,
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
  const pluginRegistry = await createPluginRegistry();
  const installedPlugins =
    await pluginRegistry.getInstalledPlugins(packageJsonPath);
  const pluginDefinitions = pluginRegistry.getPluginDefinitions();
  return createBaseConfig({
    plugins: installedPlugins,
    pluginDefinitions,
  });
};
