import type { Tree } from "@nx/devkit";

import { formatFiles, logger } from "@nx/devkit";
// @ts-expect-error bla bla bla
import { configure } from "@pjt/prettier";

export const generator = async (tree: Tree): Promise<void> => {
  await configure({
    cwd: tree.root,
    logger,
    writeFile: tree.write,
  });

  await formatFiles(tree);
};
