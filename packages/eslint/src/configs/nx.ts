import nxEslintPlugin from "@nx/eslint-plugin";
import { type Config } from "eslint/config";
import jsoncParser from "jsonc-eslint-parser";

export const nxDependencyChecks: Config[] = [
  {
    files: ["**/*.json"],
    plugins: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "@nx": nxEslintPlugin as any,
    },
    rules: {
      "@nx/dependency-checks": [
        "error",
        {
          ignoredFiles: ["{projectRoot}/eslint.config.{js,cjs,mjs,ts,cts,mts}"],
        },
      ],
    },
    languageOptions: {
      parser: jsoncParser,
    },
  },
];

export const nxPluginChecks: Config[] = [
  {
    files: ["**/package.json", "**/generators.json"],
    plugins: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "@nx": nxEslintPlugin as any,
    },
    rules: {
      "@nx/nx-plugin-checks": "error",
    },
    languageOptions: {
      parser: jsoncParser,
    },
  },
];
