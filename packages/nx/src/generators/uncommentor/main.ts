import { formatFiles, type Tree } from "@nx/devkit";

import { type Schema } from "./schema";

const main = async (tree: Tree, _options: Schema): Promise<void> => {
  await formatFiles(tree);
};

export default main;
