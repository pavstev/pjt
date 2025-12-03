import { z } from "zod";

export const ConfigurePrettierGeneratorSchema = z.object({}).strict();

export type ConfigurePrettierGeneratorSchemaType = z.infer<
  typeof ConfigurePrettierGeneratorSchema
>;
