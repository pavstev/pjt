import { writeFile } from "node:fs/promises";
import z from "zod";

type Options = {
  outFilePath: string;
  schema: z.ZodType;
};

export const exportJsonSchema = async ({
  outFilePath,
  schema,
}: Options): Promise<void> => {
  await writeFile(
    outFilePath,
    JSON.stringify(
      z.toJSONSchema(schema, {
        target: "draft-7",
      }),
      null,
      2,
    ),
    "utf-8",
  );

  console.log(`✅ Plugin schema exported to ${outFilePath}`);
};
