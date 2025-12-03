import type { ESLint } from "eslint";

import { type defineConfig } from "eslint/config";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export type EslintEntry = Parameters<typeof defineConfig>[0];

export type ExportedEslintConfig = ReturnType<typeof defineConfig>;

export const tsFiles = [
  "**/*.ts",
  "**/*.tsx",
];

export const testFiles = tsFiles.flatMap(f =>
  [
    "test",
    "spec",
  ].map(d => f.replace("/*", `/*.${d}`)),
);

export const ignoreFiles = [".gitignore"];

export const ignorePatterns = [
  "**/*.d.ts",
  "**/package.json",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyRecord = Record<string, any>;

type EslintPlugins = NonNullable<ESLint.Options["plugins"]>;
type ImportType = "resolve" | "url";

const ensureArray = <T>(arr: T | T[]): T[] =>
  Array.isArray(arr) ? arr : [arr];

export const fromRootPath = (
  rawPath: string | string[],
  importType: ImportType,
  meta: Pick<ImportMeta, "dirname" | "url">,
): string => {
  const path = ensureArray(rawPath);

  if (importType === "resolve") {
    return resolve(
      ...[
        meta.dirname,
        ...path,
      ].filter(p => Boolean(p?.length)),
    );
  }

  return new URL(path.join("/"), new URL(".", meta.url)).toString();
};

export const anyDirPattern = (
  suffix: string | string[],
  prefix = "",
): string[] =>
  ensureArray(suffix).map(
    ext =>
      `${prefix.length > 0 ? `${prefix}/` : prefix}**/*${ext.length > 0 ? `.${ext}` : ext}`,
  );

export const patterns = {
  all: anyDirPattern(""),
  astro: anyDirPattern(["astro"]),
  codeWorkspace: anyDirPattern(["code-workspace"]),
  command: anyDirPattern("", "**/commands"),
  css: anyDirPattern([
    "css",
    "scss",
    "sass",
    "less",
  ]),
  dockerfile: [
    ...anyDirPattern([
      "dockerfile",
      "Dockerfile",
    ]),
    "**/Dockerfile",
  ],
  html: anyDirPattern([
    "htm",
    "html",
  ]),
  json: anyDirPattern([
    "json",
    "jsonc",
    "json5",
  ]),
  markdown: anyDirPattern([
    "md",
    "mdx",
    "svx",
  ]),
  test: anyDirPattern(
    [
      "test",
      "spec",
    ].flatMap(left =>
      [
        "ts",
        "tsx",
      ].map(right => `${left}.${right}`),
    ),
  ),
  toml: anyDirPattern(["toml"]),
  typescript: [
    ...anyDirPattern([
      "ts",
      "tsx",
    ]),
    "**/prettier.config.ts",
  ],
  yaml: anyDirPattern([
    "yaml",
    "yml",
  ]),
} satisfies {
  [key: string]: string[];
};

export const getIgnorePatterns = (): string[] =>
  readdirSync(".", {
    encoding: "utf8",
    recursive: false,
  })
    .filter((file: string) => /^\..*ignore$/.test(file))
    .flatMap((file: string) =>
      readFileSync(file, "utf8")
        .split("\n")
        .map((line: string) => line.trim())
        .filter((line: string) => line && !line.startsWith("#")),
    );

export const asPlugins = (rawPlugin: {
  [key: string]: unknown;
}): EslintPlugins => rawPlugin as unknown as EslintPlugins;
