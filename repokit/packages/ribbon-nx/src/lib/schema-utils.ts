import type { createJiti } from "jiti";

import { type Tree } from "@nx/devkit";
import { readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import z from "zod";

const fetchCache = new Map<string, string>();

const copyRemoteSchema = async (source: string): Promise<string> => {
  if (fetchCache.has(source)) {
    const cached = fetchCache.get(source);
    if (cached !== undefined) {
      return cached;
    }
  }

  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  const response = await fetch(source);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const text = await response.text();
  fetchCache.set(source, text);
  return text;
};

const copyLocalSchema = (tree: Tree, srcPath: string): string =>
  tree.read(srcPath, "utf-8") ?? "";

const isRemoteUrl = (url: string): boolean => url.startsWith("https");

const getSchemaContent = async (tree: Tree, url: string): Promise<string> => {
  if (isRemoteUrl(url)) {
    return copyRemoteSchema(url);
  }

  return copyLocalSchema(tree, url);
};

export const ensureSchemasDirectory = (tree: Tree, outputDir: string): void => {
  if (!tree.exists(outputDir)) {
    tree.write(`${outputDir}/.gitkeep`, "");
  }
};

const writeSchemaFile = (
  tree: Tree,
  name: string,
  content: string,
  outputDir: string,
): void => {
  const destPath = `${outputDir}/${name}.schema.json`;
  tree.write(destPath, content);
};

export const processSchemaEntry = async (
  tree: Tree,
  entry: [string, string],
  outputDir: string,
): Promise<void> => {
  const [
    name,
    url,
  ] = entry;
  const content = await getSchemaContent(tree, url);
  writeSchemaFile(tree, name, content, outputDir);
};

type SchemaFileInfo = {
  exportedSchemaName: string;
  generatorName: string;
  path: string;
};

const processSchemaFile = (
  fullPath: string,
  root: string,
  schemaFiles: SchemaFileInfo[],
): void => {
  const relativePath = relative(root, fullPath);
  const parts = relativePath.split("/");
  // Expecting a path like packages/ribbon-nx/src/generators/generator-name/schema.ts
  const generatorsIndex = parts.indexOf("generators");
  if (generatorsIndex !== -1 && generatorsIndex + 1 < parts.length) {
    const generatorName = parts[generatorsIndex + 1] as string;
    const capitalizedGeneratorName = generatorName
      .split("-")
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");
    const exportedSchemaName = `${capitalizedGeneratorName}GeneratorSchemaZod`;
    schemaFiles.push({
      exportedSchemaName,
      generatorName,
      path: fullPath,
    });
  }
};

const traverseDirectory = (
  currentPath: string,
  root: string,
  schemaFiles: SchemaFileInfo[],
): void => {
  const children = readdirSync(currentPath);
  for (const child of children) {
    if (child.startsWith(".")) {
      continue;
    } // skip hidden

    const fullPath = join(currentPath, child);
    const isFile = statSync(fullPath).isFile();
    if (isFile && child === "schema.ts") {
      processSchemaFile(fullPath, root, schemaFiles);
    } else if (!isFile) {
      traverseDirectory(fullPath, root, schemaFiles);
    }
  }
};

export const findSchemaTsFiles = (
  _tree: Tree,
  root: string,
): SchemaFileInfo[] => {
  const schemaFiles: SchemaFileInfo[] = [];
  traverseDirectory(root, root, schemaFiles);
  return schemaFiles;
};

export const processGeneratorSchemaFile = async (
  tree: Tree,
  localJiti: ReturnType<typeof createJiti>,
  schemaFile: SchemaFileInfo,
): Promise<void> => {
  const { exportedSchemaName, path: schemaTsPath } = schemaFile;

  const loadedModule: Record<string, z.ZodObject> =
    await localJiti.import(schemaTsPath);
  const schema = loadedModule[exportedSchemaName];

  if (!schema) {
    throw new Error(
      `Could not find exported schema '${exportedSchemaName}' in ${schemaTsPath}`,
    );
  }

  const jsonSchema = z.toJSONSchema(schema);
  tree.write(
    join(dirname(schemaTsPath), "generator-options.schema.json"),
    JSON.stringify(jsonSchema, null, 2),
  );
};
