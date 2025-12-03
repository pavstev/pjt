import type { Config } from "markdownlint-cli2";

const config: Config = {
  config: {
    default: true,
    MD001: true, // Enable heading increment check
    MD003: { style: "atx" },
    MD004: { style: "dash" },
    MD007: { indent: 2 },
    MD014: false,
    MD024: { siblings_only: true },
    MD029: { style: "ordered" },
    MD033: {
      allowed_elements: [
        "a",
        "details",
        "div",
        "em",
        "img",
        "p",
        "strong",
        "summary",
      ],
    },
    MD036: false,
    MD041: false,
    MD046: { style: "fenced" },
  },
  ignores: [
    "**/.git/**",
    "**/.nx/**",
    "**/dist/**",
    "**/node_modules/**",
    "**/tmp/**",
  ],
  gitignore: true,
  fix: true,
  globs: ["**/*.md"],
};

export default config;
