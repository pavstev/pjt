import markdown from "@eslint/markdown";
import { type Config } from "eslint/config";

// eslint-disable-next-line no-restricted-syntax
import * as eslintPluginMdx from "eslint-plugin-mdx";

export const markdownConf: Config[] = [
  {
    files: ["**/*.md"],
    plugins: {
      markdown: markdown as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    },
    language: "markdown/commonmark",
    rules: {
      "markdown/no-html": "error",
      "no-irregular-whitespace": "off",
      "no-trailing-spaces": "off",
      "eol-last": "off",
    },
  },
];

export const mdxConf: Config[] = [
  {
    ...eslintPluginMdx.configs.flat,
    files: ["**/*.mdx"],
  },
];
