import { z } from "zod";

export const DownloadReadmesGeneratorSchema = z.object({}).strict();

export type DownloadReadmesGeneratorSchemaType = z.infer<
  typeof DownloadReadmesGeneratorSchema
>;
