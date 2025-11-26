import { z } from "zod";

export const GitCleanGeneratorSchema = z
  .object({
    dir: z.string().default(process.cwd()),
    hard: z.boolean().default(false),
  })
  .strict();

export type GitCleanGeneratorSchemaType = z.infer<
  typeof GitCleanGeneratorSchema
>;
