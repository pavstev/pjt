import { join } from "node:path";
import { exportJsonSchema } from "../../../core/dist/src/export-schema";

import { PluginDefinitionsSchema } from "../schema";

void (async () => {
  await exportJsonSchema({
    outFilePath: join(__dirname, "../json/prettier-plugins.schema.json"),
    schema: PluginDefinitionsSchema,
  });
})();
