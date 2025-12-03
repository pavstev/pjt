import { formatFiles, type Tree } from "@nx/devkit";
import { execSync } from "child_process";

import { type Schema } from "./schema";

const main = async (tree: Tree, _options: Schema): Promise<void> => {
  execSync(`npx barrelsby -d ${tree.root}`, { stdio: "inherit" });
  await formatFiles(tree);
  console.log(`Cooper generator: Barrel files generated successfully`);
};

export default main;
