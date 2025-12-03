import { z } from "zod";

export const CooperGeneratorSchemaZod = z
  .object({
    outputDir: z.string().optional(),
    patterns: z.array(z.string()).optional(),
    workspaceRoot: z.string().optional(),
  })
  .partial();

export type Schema = {
  outputDir?: string;
  patterns?: string[];
  workspaceRoot?: string;
};
