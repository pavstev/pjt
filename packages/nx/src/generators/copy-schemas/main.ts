import { formatFiles } from "@nx/devkit";

import { validate } from "../../lib/options";
import {
  ensureSchemasDirectory,
  processSchemaEntry,
} from "../../lib/schema-utils";
import { CopySchemasGeneratorSchemaZod } from "./schema";

export default validate(
  CopySchemasGeneratorSchemaZod,
  async (tree, options) => {
    const outputDir = options.outputDir || "packages/schemas/src";
    const map = options.map || {
      "cspell":
        "https://raw.githubusercontent.com/streetsidesoftware/cspell/main/packages/cspell-types/cspell.schema.json",
      "knip": "./node_modules/knip/schema.json",
      "nx": "./node_modules/nx/schemas/nx-schema.json",
      "oxlint":
        "https://raw.githubusercontent.com/oxc-project/oxc/refs/heads/main/npm/oxlint/configuration_schema.json",
      "package-json": "https://json.schemastore.org/package.json",
      "prettierrc": "https://json.schemastore.org/prettierrc",
      "project": "./node_modules/nx/schemas/project-schema.json",
      "resume": "./node_modules/@jsonresume/schema/schema.json",
      "schema-2020-12": "https://json-schema.org/draft/2020-12/schema",
      "tsconfig": "https://json.schemastore.org/tsconfig.json",
    };

    ensureSchemasDirectory(tree, outputDir);

    await Promise.all(
      Object.entries(map).map(([name, url]) =>
        processSchemaEntry(tree, [name, url as string], outputDir),
      ),
    );

    await formatFiles(tree);
  },
);
