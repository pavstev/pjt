import * as mdx from "eslint-plugin-mdx";
import { type Config } from "eslint/config";

import { fromRootPath, patterns } from "./constants";

export const mdxConfig: Config[] = [
  {
    ...mdx.flat,
    files: patterns.markdown,
    processor: mdx.createRemarkProcessor({
      cwd: process.cwd(),
      ignoreRemarkConfig: false,
      lintCodeBlocks: false,
      remarkConfigPath: fromRootPath(".remarkrc.js", "resolve", import.meta),
    }),
    rules: {
      "remark-lint-list-item-spacing": "off",
    },
  },
];
