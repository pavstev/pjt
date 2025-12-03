import type { Config, Options } from "prettier";

const exts = {
  astro: ["astro"],
  css: ["css", "scss", "sass", "less"],
  dockerfile: ["dockerfile", "Dockerfile"],
  html: ["htm", "html"],
  json: ["json", "jsonc", "json5", "code-workspace"],
  markdown: ["md", "mdx", "svx"],
  py: ["py"],
  shell: ["sh", "zsh"],
  svelte: ["svelte"],
  toml: ["toml"],
  typescript: ["ts", "tsx"],
  vue: ["vue"],
  yaml: ["yaml", "yml"],
} satisfies Record<string, string[]>;

type Ext = keyof typeof exts;

type OverrideConfig = NonNullable<Config["overrides"]>[number];

const entries: Partial<
  Record<Ext, { excludeFiles?: string[]; options?: Partial<Options> }>
> = {
  astro: {},
  css: { options: { singleQuote: false } },
  dockerfile: {},
  html: { options: { singleAttributePerLine: true } },
  json: { excludeFiles: ["package.json"] },
  markdown: { options: { printWidth: 80, proseWrap: "always" } },
  py: {},
  shell: {},
  svelte: {
    options: {
      svelteAllowShorthand: true,
      svelteIndentScriptAndStyle: true,
      svelteSortOrder: "options-scripts-markup-styles",
      svelteStrictMode: false,
    },
  },
  toml: {},
  typescript: {},
  vue: {},
  yaml: { options: { singleQuote: false } },
};

const overrides: OverrideConfig[] = [
  ...Object.entries(entries).map(([parser, config]) => {
    const ext = exts[parser as Ext];
    const files = ext.map(p => `*.${p}`);
    return {
      excludeFiles: config?.excludeFiles,
      files,
      options: { parser, ...config?.options },
    };
  }),
  {
    files: "*.svx",
    options: {
      parser: "markdown",
      proseWrap: "preserve",
    },
  },
  {
    files: [
      "justfile",
      "*.just",
    ],
    options: {
      tabWidth: 4,
      useTabs: false,
    },
  },
  {
    files: [
      "slides.mdc",
      "pages/*.mdc",
    ],
    options: {
      parser: "slidev",
      plugins: ["prettier-plugin-slidev"],
    },
  },
  {
    files: "uno.config.ts",
    options: {
      printWidth: 8000,
    },
  },
];

const config: Options = {
  $schema: "https://json.schemastore.org/prettierrc",
  arrowParens: "avoid",
  bracketSameLine: false,
  bracketSpacing: true,
  embeddedLanguageFormatting: "auto",
  endOfLine: "lf",
  htmlWhitespaceSensitivity: "css",
  insertPragma: false,
  jsxSingleQuote: false,
  overrides,
  plugins: [
    "@prettier/plugin-oxc",
    "@prettier/plugin-xml",
    "@svgr/plugin-prettier",
    "prettier-plugin-astro",
    "prettier-plugin-css-order",
    "prettier-plugin-ember-template-tag",
    "prettier-plugin-ignored",
    "prettier-plugin-jsdoc",
    "prettier-plugin-multiline-arrays",
    "prettier-plugin-organize-attributes",
    "prettier-plugin-packagejson",
    "prettier-plugin-prisma",
    "prettier-plugin-sh",
    "prettier-plugin-slidev",
    "prettier-plugin-sort-json",
    "prettier-plugin-sort-json",
    "prettier-plugin-sort-package-json",
    "prettier-plugin-sql",
    "prettier-plugin-svelte",
    "prettier-plugin-toml",
  ],
  printWidth: 80,
  proseWrap: "preserve",
  quoteProps: "consistent",
  requirePragma: false,
  semi: true,
  singleAttributePerLine: false,
  singleQuote: false,
  tabWidth: 2,

  trailingComma: "all",
  useTabs: false,
  vueIndentScriptAndStyle: true,
};

export default config;
