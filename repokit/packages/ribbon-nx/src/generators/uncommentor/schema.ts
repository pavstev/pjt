import { z } from "zod";

export const UncommentorGeneratorSchemaZod = z
  .object({
    name: z.string(),
  })
  .partial();

export type Schema = {
  name: string;
};
