import { defineConfig } from "eslint/config";

const config = await import("./src/eslint/index.js").then(async m =>
  defineConfig([
    await m.getIgnores(),
    m.recommended,
    ...m.jsonc,
    ...m.jsonSchema,
    m.prettierConf,
    ...m.tsRecommended,
    m.tsRules,
  ]),
);

export default config;