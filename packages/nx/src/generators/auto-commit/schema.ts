import { z } from "zod";

export const AutoCommitGeneratorSchema = z
  .object({
    noVerify: z.boolean().default(false),
  })
  .strict();

export type AutoCommitGeneratorSchemaType = z.infer<
  typeof AutoCommitGeneratorSchema
>;
