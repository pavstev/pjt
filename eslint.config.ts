import { defineConfig } from "eslint/config";
// eslint-disable-next-line no-restricted-syntax
import * as m from "./src/eslint";

export default defineConfig([
  await m.getIgnores(),
  m.recommended,
  ...m.jsonc,
  ...m.jsonSchema,
  m.prettierConf,
  ...m.tsRecommended,
  m.tsRules,
]);
