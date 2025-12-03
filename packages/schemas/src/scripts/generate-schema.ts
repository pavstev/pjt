import { exportJsonSchema } from "@pjt/core";
import { join } from "node:path";

import { PluginDefinitionsSchema } from "../schema";

void (async () => {
  await exportJsonSchema({
    outFilePath: join(__dirname, "../json/prettier-plugins.schema.json"),
    schema: PluginDefinitionsSchema,
  });
})();
