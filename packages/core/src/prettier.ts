import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { Config } from "prettier";

import { createBaseConfig } from "./lib/prettier/config";
import { createPluginRegistry } from "./lib/prettier/registry";
import { installPackages } from "./package-manager";

type Options = {
  cwd: string;
  logger: {
    log: (data: string, ...rest: unknown[]) => void;
  };
  writeFile: (file: string, data: string) => Promise<void>;
};

const readPackageUp = async (options: { cwd: string }) => {
  let currentDir = options.cwd;
  while (true) {
    try {
      const packageJsonPath = join(currentDir, "package.json");
      const content = await readFile(packageJsonPath, "utf-8");
      return { path: packageJsonPath, packageJson: JSON.parse(content) };
    } catch {
      const parentDir = dirname(currentDir);
      if (parentDir === currentDir) {
        return null;
      }
      currentDir = parentDir;
    }
  }
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
