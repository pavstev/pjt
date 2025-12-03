import { formatFiles, type Tree } from "@nx/devkit";
import { promises as fs } from "fs";
import { glob } from "glob";
import { compile } from "json-schema-to-typescript";
import path from "path";

import { type Schema } from "./schema";

const main = async (tree: Tree, options: Schema): Promise<void> => {
  const workspaceRoot = options.workspaceRoot || tree.root;
  const outputDir =
    options.outputDir || "node_modules/@repokit/ribbon-nx-schemas/generated";
  const patterns = options.patterns || [
    "**/src/{generators,executors}/*/*.schema.json",
  ];

  console.log("🔧 Generating TypeScript schemas from JSON schemas...");
  console.log(`📂 Workspace root: ${workspaceRoot}`);
  console.log(`📂 Output directory: ${outputDir}`);
  console.log(`🔍 Patterns: ${patterns.join(", ")}`);

  try {
    for (const pattern of patterns) {
      const files = await glob(pattern, { cwd: workspaceRoot });
      for (const file of files) {
        const fullPath = path.join(workspaceRoot, file);
        const content = await fs.readFile(fullPath, "utf-8");
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const schema = JSON.parse(content);
        const schemaName = path.basename(file, ".schema.json");
        const tsContent = await compile(schema, schemaName);
        const outputFile = path.join(outputDir, `${schemaName}.ts`);
        tree.write(outputFile, tsContent);
      }
    }

    console.log(`🎉 Successfully generated TypeScript schemas!`);
  } catch (error) {
    console.error(`❌ Failed to generate TypeScript schemas:`, error);
    throw error;
  }

  await formatFiles(tree);
};

export default main;
