import { exportJsonSchema } from "@pjt/core";
import { join } from "node:path";
import { PluginDefinitionsSchema } from "../schema/schema";

exportJsonSchema({
  outFilePath: join(__dirname, "../schema/prettier-plugins.schema.json"),
  schema: PluginDefinitionsSchema,
});
