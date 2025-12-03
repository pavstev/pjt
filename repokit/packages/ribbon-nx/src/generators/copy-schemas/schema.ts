import { z } from "zod";

const LocalUrlZod = z.string().regex(/^\.\/node_modules\/.*\.json$/);

const RemoteUrlZod = z.string().regex(/^https:\/\/\S+$/);

const SchemaUrlZod = z.union([
  LocalUrlZod,
  RemoteUrlZod,
]);

export const CopySchemasGeneratorSchemaZod = z
  .object({
    map: z.record(z.string(), SchemaUrlZod).optional(),
    outputDir: z.string().optional(),
  })
  .loose();
