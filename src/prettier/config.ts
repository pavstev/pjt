import type { Config } from "prettier";

export const config: Config = {
  arrowParens: "avoid",
  overrides: [
    {
      files: "*.jsonc",
      options: {
        trailingComma: "all",
      },
    },
    {
      files: "*.code-workspace",
      options: {
        parser: "jsonc",
        trailingComma: "all",
      },
    },
    {
      files: ["*.json", "!package.json", "!**/package.json"],
      options: {
        parser: "json",
      },
    },
    {
      files: ["package.json", "**/package.json"],
      options: {
        parser: "json-stringify",
        plugins: ["prettier-plugin-packagejson"],
      },
    },
    {
      files: ["*.md", "**/*.md"],
      options: {
        parser: "markdown",
      },
    },
    {
      files: ["*.yaml", "*.yml", "**/*.yaml", "**/*.yml"],
      options: {
        parser: "yaml",
      },
    },
    {
      files: ["*.ts", "**/*.ts"],
      options: {
        parser: "typescript",
      },
    },
    {
      files: ["*.js", "**/*.js"],
      options: {
        parser: "babel",
      },
    },
  ],
  plugins: ["prettier-plugin-packagejson"],
};
