import { includeIgnoreFile } from "@eslint/compat";
import { dirname, resolve as r } from "node:path";
import { fileURLToPath } from "node:url";

import {
  type EslintEntry,
  getIgnorePatterns,
  ignoreFiles,
  ignorePatterns,
} from "../constants";

export const ignores: EslintEntry[] = [
  {
    ignores: Array.from(
      new Set([
        "**/coverage/",
        "**/dist/",
        ...getIgnorePatterns(),
        ...ignoreFiles.flatMap(
          file =>
            includeIgnoreFile(
              r(
                dirname(fileURLToPath(import.meta.url)),
                "../../../../..",
                file,
              ),
            ).ignores ?? [],
        ),
        ...ignorePatterns,
      ]),
    ),
  },
];
