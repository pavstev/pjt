import { z } from "zod";

export const RsbuildAppGeneratorSchemaZod = z.object({
  name: z.string(),
  style: z.enum(["css", "scss", "less", "stylus"]).optional().default("css"),
  bundler: z.enum(["rsbuild"]).default("rsbuild"),
  unitTestRunner: z.enum(["jest", "vitest", "none"]).optional().default("jest"),
  e2eTestRunner: z
    .enum(["cypress", "playwright", "none"])
    .optional()
    .default("cypress"),
  tags: z.string().optional(),
  directory: z.string().optional(),
  standalone: z.boolean().optional().default(false),
  skipFormat: z.boolean().optional(),
});

export type Schema = z.infer<typeof RsbuildAppGeneratorSchemaZod>;
