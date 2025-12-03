import type { Config } from "eslint/config";

import { defineConfig } from "eslint/config";

import { tsFiles } from "../constants";
import { defaultConfig } from "./default";

const config: Config[] = defineConfig(...(await defaultConfig()), {
  files: tsFiles,
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["./*.config.ts"],
      },
    },
  },
});

export default config;
