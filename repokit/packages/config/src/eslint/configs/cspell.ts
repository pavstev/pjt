import cspell from "@cspell/eslint-plugin";

import { type EslintEntry, patterns } from "../constants";

export const cspellConfig: EslintEntry[] = [
  {
    files: patterns.all,
    ignores: [
      patterns.markdown,
      patterns.codeWorkspace,
      "**/*.schema.json",
    ].flat(),
    plugins: {
      "@cspell": cspell,
    },
    rules: {
      "@cspell/spellchecker": "off",
      // "@cspell/spellchecker": [
      //   "error",
      //   {
      //     autoFix: true,
      //     // configFile: cspellConfigPath,
      //   },
      // ],
    },
  },
];
