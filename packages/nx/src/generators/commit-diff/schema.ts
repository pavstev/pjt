import { z } from "zod";

export const CommitDiffGeneratorSchema = z.object({}).strict();

export type CommitDiffGeneratorSchemaType = z.infer<
  typeof CommitDiffGeneratorSchema
>;
