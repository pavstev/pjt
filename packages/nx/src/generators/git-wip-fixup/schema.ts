import { z } from "zod";

export const GitWipFixupGeneratorSchemaZod = z
  .object({
    dryRun: z.boolean().optional(),
    limit: z.number().optional(),
  })
  .strict();
