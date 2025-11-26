import type { Tree } from "@nx/devkit";

import { formatFiles, logger } from "@nx/devkit";
import { configure } from "@pjt/core";

export const generator = async (tree: Tree): Promise<void> => {
  await configure({
    cwd: tree.root,
    logger,
    writeFile: async (file: string, data: string) => tree.write(file, data),
  });

  await formatFiles(tree);
};
