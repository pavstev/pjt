import { z } from "zod";

export const schema = z.object({});

export type Schema = z.infer<typeof schema>;
