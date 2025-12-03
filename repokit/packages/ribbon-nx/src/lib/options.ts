import type z from "zod";

import { type Tree } from "@nx/devkit";

type DefaultOptions<T extends z.ZodObject> =
  | ((tree: Tree) => z.infer<T>)
  | undefined
  | z.infer<T>;

type SyncGeneratorResult = void;

const resolveDefaultOptions = <T extends z.ZodObject>(
  tree: Tree,
  options?: DefaultOptions<T>,
): undefined | z.infer<T> => {
  if (!options) {
    return undefined;
  }

  if (typeof options === "function") {
    return options(tree);
  }

  return options;
};

export const validate =
  <T extends z.ZodObject>(
    schema: T,
    callback: (tree: Tree, options: z.infer<T>) => Promise<SyncGeneratorResult>,
    rawDefaultOptions?: DefaultOptions<T>,
  ) =>
  async (
    tree: Tree,
    options: undefined | z.input<T>,
  ): Promise<SyncGeneratorResult> => {
    const data = {
      ...resolveDefaultOptions(tree, rawDefaultOptions),
      ...options,
    };

    const result = schema.safeParse(data);

    if (!result.success) {
      throw new Error(`Invalid options: ${result.error.message}`);
    }

    return callback(tree, result.data);
  };
