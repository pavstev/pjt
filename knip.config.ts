import type { KnipConfig } from "knip";

const config: KnipConfig = {
  workspaces: {
    ".": {
      entry: ["src/main.ts"],
      project: [
        "src/eslint/**/*.ts",
        "src/prettier/**/*.ts",
        "src/lib/**/*.ts",
      ],
      ignoreDependencies: ["globify-gitignore"],
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
      entry: ["index.md"],
      project: ["**/*.md"],
    },
  },
};

export default config;
