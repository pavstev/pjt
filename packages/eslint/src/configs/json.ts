import eslintPluginJsonSchemaValidator from "eslint-plugin-json-schema-validator";
import eslintPluginJsonc from "eslint-plugin-jsonc";
import { type Config } from "eslint/config";

import { withExtensions } from "../helper";

const forJsonFiles = withExtensions(["jsonTODO"]);

export const jsonc: Config[] = forJsonFiles(
  ...(eslintPluginJsonc.configs["flat/recommended-with-json"] as Config[]),
);

export const jsonSchema: Config[] = forJsonFiles(
  ...eslintPluginJsonSchemaValidator.configs["flat/recommended"],
);
