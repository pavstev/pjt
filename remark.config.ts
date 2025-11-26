import type { Config } from "remark";

const config: Config = {
  plugins: ["remark-preset-lint-markdown-style-guide"],
  rules: {
    "remark-lint-emphasis-marker": "off",
    "remark-lint-list-item-spacing": "off",
  },
  settings: {},
};

export default config;
