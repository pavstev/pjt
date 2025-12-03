// @ts-expect-error bla bla bla
import { configure } from "@pjt/prettier";

import { formatFiles, logger, Tree } from "@nx/devkit";

export const generator = async (tree: Tree): Promise<void> => {
  await configure({
    cwd: tree.root,
    writeFile: tree.write,
    logger,
  });

  await formatFiles(tree);
};
