import type { KnipConfig } from "knip";

const config: KnipConfig = {
  workspaces: {
    ".": {
      entry: ["src/main.ts", "src/eslint/index.ts", "src/index.ts"],
      project: [
        "src/lib/**/*.ts",
        "src/eslint/**/*.ts",
        "src/prettier/**/*.ts",
      ],
      ignoreDependencies: ["globify-gitignore"],
      ignoreFiles: [
        "src/index.ts",
        "src/lib/completions.ts",
        "src/lib/fs.ts",
        "src/eslint/config.ts",
        "src/prettier/config.ts",
        "src/prettier/index.ts",
      ],
    },
    docs: {
      entry: ["src/content/docs/index.md"],
      project: ["src/**/*.md"],
    },
  },
};

export default config;
