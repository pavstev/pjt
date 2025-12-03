import type { KnipConfig } from "knip";

const config: KnipConfig = {
  workspaces: {
    ".": {
      entry: ["src/main.ts"],
      project: ["src/eslint/**/*.ts", "src/prettier/**/*.ts"],
      ignoreDependencies: [
        "astro",
        "cac",
        "globify-gitignore",
        "simple-git",
        "tsx",
      ],
      ignoreBinaries: ["astro"],
      ignoreFiles: [
        "src/index.ts",
        "src/lib/completions.ts",
        "src/lib/fs.ts",
        "src/prettier/config.ts",
        "src/prettier/index.ts",
        "src/eslint/config.ts",
      ],
    },
  },
};

export default config;
