import { formatFiles } from "@nx/devkit";
import { createJiti } from "jiti";

import { validate } from "../../lib/options";
import {
  findSchemaTsFiles,
  processGeneratorSchemaFile,
} from "../../lib/schema-utils";
import { ExportGeneratorSchemasGeneratorSchemaZod } from "./schema";

export default validate(
  ExportGeneratorSchemasGeneratorSchemaZod,
  async tree => {
    const workspaceRoot = tree.root;
    const _jiti = createJiti(workspaceRoot, { interopDefault: true });
    const schemaFiles = findSchemaTsFiles(tree, workspaceRoot);

    await Promise.all(
      schemaFiles.map(schemaFile =>
        processGeneratorSchemaFile(tree, _jiti, schemaFile),
      ),
    );

    await formatFiles(tree);
  },
);
