import { defineConfig } from "eslint/config";

export default await import("./src/config/eslint-config.js").then(async m =>
  defineConfig([
    await m.getIgnores(),
    m.recommended,
    ...m.jsonc,
    ...m.jsonSchema,
    m.prettierConf,
    ...m.tsRecommended,
    m.prettierPlugin,
    m.tsRules,
  ]),
);
