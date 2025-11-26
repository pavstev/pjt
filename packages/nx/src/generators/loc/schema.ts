import { z } from "zod";

export const LocGeneratorSchema = z.object({}).strict();

export type LocGeneratorSchemaType = z.infer<typeof LocGeneratorSchema>;
