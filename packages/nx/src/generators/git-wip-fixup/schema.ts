import { z } from "zod";

export const GitWipFixupGeneratorSchemaZod = z
  .object({
    limit: z.number().optional(),
  })
  .strict();
