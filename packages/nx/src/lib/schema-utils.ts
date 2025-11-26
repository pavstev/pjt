import { type Tree } from "@nx/devkit";
import { readFileSync } from "fs";
import type { Jiti } from "jiti/lib/types";
import { join } from "path";

export const ensureSchemasDirectory = (tree: Tree, outputDir: string): void => {
  if (!tree.exists(outputDir)) {
    tree.write(join(outputDir, ".gitkeep"), "");
  }
};

export const findSchemaTsFiles = (
  _tree: Tree,
  _workspaceRoot: string,
): string[] => {
  // Placeholder: find .ts files in generators that have schema
  const files: string[] = [];
  // Simple glob or something, but for now return empty
  return files;
};

export const processGeneratorSchemaFile = async (
  _tree: Tree,
  _jiti: Jiti,
  _schemaFile: string,
): Promise<void> => {
  // Placeholder: process the schema file
};

export const processSchemaEntry = async (
  tree: Tree,
  [name, url]: [string, string],
  outputDir: string,
): Promise<void> => {
  let content: string;

  if (url.startsWith("https://")) {
    // Remote URL
    try {
      const response = await fetch(url);
      if (!response.ok) return;

      content = await response.text();
    } catch {
      return;
    }
  } else if (url.startsWith("./")) {
    // Local file
    try {
      content = readFileSync(join(tree.root, url), "utf-8");
    } catch {
      return;
    }
  } else {
    return;
  }

  tree.write(join(outputDir, `${name}.schema.json`), content);
};
