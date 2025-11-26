import markdown from "@eslint/markdown";
import * as eslintPluginMdx from "eslint-plugin-mdx";
import { type Config } from "eslint/config";

export const markdownConf: Config[] = [
  {
    files: ["**/*.md"],
    language: "markdown/commonmark",
    plugins: {
      markdown: markdown as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    },
    rules: {
      "eol-last": "off",
      "markdown/no-html": "error",
      "no-irregular-whitespace": "off",
      "no-trailing-spaces": "off",
    },
  },
];

export const mdxConf: Config[] = [
  {
    ...eslintPluginMdx.configs.flat,
    files: ["**/*.mdx"],
  },
];
