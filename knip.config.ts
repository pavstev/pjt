import type { KnipConfig } from "knip";

const config: KnipConfig = {
  workspaces: {
    ".": {
      entry: ["src/main.ts"],
      project: ["src/eslint/**/*.ts", "src/prettier/**/*.ts"],
      ignoreDependencies: ["cac", "globify-gitignore", "simple-git", "tsx"],
      ignoreFiles: [
        "src/index.ts",
        "src/lib/completions.ts",
        "src/lib/fs.ts",
        "src/prettier/config.ts",
        "src/prettier/index.ts",
        "src/eslint/config.ts",
      ],
    },
    docs: {
      ignoreDependencies: [
        "@types/mdx",
        "eslint",
        "eslint-config-next",
        "autoprefixer",
        "postcss",
      ],
      ignoreFiles: [
        ".source/source.config.mjs",
        ".source/**",
        "out/**",
        "source.config.ts",
      ],
    },
  },
};

export default config;
