import { defineConfig } from "eslint/config";

import { tsFiles } from "../constants";
import { defaults } from "./defaults";

const config: ReturnType<typeof defineConfig> = defineConfig(...defaults, {
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
