import type { LibraryOptions } from "vite";
import { ExportConfig } from "./types";

type Exports = LibraryOptions["entry"];

export const generateEntry = (exports: ExportConfig): Exports => {
  const entry: Exports = {};
  for (const [_key, value] of Object.entries(exports)) {
    let path: string | undefined;

    if (typeof value === "string") {
      path = value;
    } else if (typeof value === "object" && value.require) {
      path = value.require;
    }

    if (path?.endsWith(".cjs")) {
      const entryKey = path.replace("./dist/", "").replace(".cjs", "");
      const srcPath =
        entryKey === "index"
          ? `src/${entryKey}.ts`
          : entryKey.includes("/")
            ? `src/${entryKey}.ts`
            : `src/${entryKey}/index.ts`;
      entry[entryKey] = srcPath;
    }
  }

  return entry;
};
