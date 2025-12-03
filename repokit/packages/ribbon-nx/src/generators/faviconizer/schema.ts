import { z } from "zod";

export const FaviconizerGeneratorSchemaZod = z
  .object({
    appDescription: z.string(),
    appName: z.string(),
    appShortName: z.string(),
    backgroundColor: z.string().optional(),
    input: z.string(),
    output: z.string().optional(),
    themeColor: z.string().optional(),
  })
  .partial();

export type Schema = {
  appDescription: string;
  appName: string;
  appShortName: string;
  backgroundColor?: string;
  input: string;
  output?: string;
  themeColor?: string;
};
