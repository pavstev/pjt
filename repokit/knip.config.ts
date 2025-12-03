import type { KnipConfig } from "knip";

const extensions = [
  "astro",
  "tsx",
  "ts",
  "css",
  "md",
  "mdx",
];

const createPaths = (
  dirs: Iterable<string>,
  paths: Iterable<string> = new Set<string>(),
): string[] => {
  const result = new Set<string>(paths);

  for (const dir of Array.from(dirs)) {
    for (const ext of extensions) {
      result.add(`${dir}/**/*.${ext}`);
    }
  }

  return Array.from(result);
};

const config: KnipConfig = {
  $schema: "https://unpkg.com/knip@latest/schema.json",
  astro: {
    config: ["astro.config.ts"],
    entry: createPaths(["src"], ["src/main.astro"]),
  },
  commitlint: {
    config: [
      "commitlint.config.ts",
      "commitlint.config.js",
    ],
    project: ["commitlint.config.ts"],
  },
  compilers: {
    astro: true,
    mdx: true,
  },
  cspell: {
    config: [
      "config/cspell.config.js",
      "cspell.config.js",
    ],
  },
  entry: [
    "src/main.tsx",
    "src/components/**/*.{ts,tsx}",
    "src/lib/**/*.{ts,tsx}",
    "markdownlint.config.ts",
    "postcss.config.mjs",
    "src/routes/**/+{page,server,page.server,error,layout,layout.server}{,@*}.{ts,svelte}",
    "src/hooks.{server,client}.ts",
    "src/hooks.ts",
    "src/params/*.ts",
  ],
  eslint: false,
  ignore: [
    "packages/ribbon-nx/eslint.config.ts",
    "packages/ribbon-nx/vitest.config.mjs",
  ],

  lefthook: {
    config: ["lefthook.yml"],
  },
  nx: {
    config: [
      "nx.json",
      "project.json",
      "{packages,tools}/*/project.json",
      "package.json",
    ],
  },
  playwright: {
    config: ["playwright.config.ts"],
  },
  postcss: {
    config: ["postcss.config.ts"],
  },
  prettier: {
    config: [
      ".prettierrc",
      ".prettierrc.json",
    ],
  },
  project: [
    "**/*.{js,ts,tsx}",
    "src/**/*.{ts,tsx,js,jsx}",
    "src/env.d.ts",
    "tsconfig.base.json",
  ],
  remark: {
    config: [".remarkrc.js"],
  },
  rspack: {
    config: "rspack.config.ts",
  },
  stylelint: {
    config: [
      "**/stylelint.config.{js,cjs,mjs,ts}",
      "stylelint.config.cjs",
    ],
    project: ["nx.json"],
  },
  svelte: {
    config: "packages/web/svelte.config.js",
    entry: [
      "svelte.config.js",
      "src/routes/**/+{page,server,page.server,error,layout,layout.server}{,@*}.{ts,svelte}",
      "src/hooks.{server,client}.ts",
      "src/hooks.ts",
      "src/params/*.ts",
    ],
    project: [
      "src/lib/**/*.{ts,svelte}",
      "vite.config.ts",
      "src/i18n/**/*.ts",
      ".svelte-kit/**/*",
      "tsconfig.json",
    ],
  },
  workspaces: {
    ".": {
      astro: {},
      cspell: {
        config: ["cspell.config.js"],
      },
      entry: [
        "scripts/*.ts",
        "markdownlint/*.ts",
        "commitlint.config.ts",
        "eslint.rules.js",
      ],
      markdownlint: {
        entry: ["markdownlint/*.ts"],
        project: [
          "markdownlint/**/*.ts",
          "docs/**/*.md",
        ],
      },

      project: [
        "scripts/**/*.ts",
        "markdownlint/**/*.ts",
      ],
      tailwind: {},
    },
    "packages/*": {
      entry: [
        "{index,cli}.ts",
        "src/index.ts",
      ],
      project: [
        "**/*.ts",
        "**/*.{js,ts,tsx}",
      ],
      typescript: {
        config: ["tsconfig.json"],
      },
    },
    "packages/cli": {
      entry: ["src/main.ts"],
      project: ["src/**/*.ts"],
      typescript: {
        config: ["tsconfig.json"],
      },
    },
    "packages/config": {
      entry: ["**/index.ts"],
      eslint: {},
      project: ["src/**/*.ts"],
      typescript: {},
    },
    "packages/ribbon": {
      entry: [
        "index.d.ts",
        "src/lib.rs",
      ],
      eslint: {},
      ignore: ["index.js"],
      project: [
        "src/**/*.rs",
        "src/**/*.ts",
      ],
      typescript: {},
    },
    "packages/ribbon-nx": {
      entry: [
        "src/index.ts",
        "src/{generators,executors}/*/main.ts",
      ],
      ignore: ["eslint.config.ts"],
      project: ["src/**/*.ts"],
      typescript: {},
    },

    "packages/schemas": {
      project: ["src/**/*.json"],
    },
  },
};

export default config;
