import type { Tree } from "@nx/devkit";
import type { z } from "zod";

/**
 *
 * @param schema
 * @param generator
 */
export const validate = <T extends z.ZodType>(
  schema: T,
  generator: (tree: Tree, options: z.infer<T>) => Promise<void>,
) => {
  return async (tree: Tree, options: unknown) => {
    const parsed = schema.parse(options);
    return generator(tree, parsed);
  };
};
