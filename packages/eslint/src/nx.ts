import base from "@nx/eslint-plugin";
import { type Config } from "eslint/config";
import tseslint from "typescript-eslint";

export const nx: any = [
  ...(base.configs["flat/base"] as Config[]),
  ...(base.configs["flat/typescript"] as Config[]),
  ...(base.configs["flat/javascript"] as Config[]),
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
  },
  // {
  //   files: tsFiles,
  //   ignores: ["**/eslint.config.ts", "**/vitest.config.ts"],
  //   rules: {
  //     "@nx/enforce-module-boundaries": [
  //       "error",
  //       {
  //         allow: ["^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$"],
  //         depConstraints: [
  //           {
  //             sourceTag: "scope:vite-app",
  //           },
  //           {
  //             onlyDependOnLibsWithTags: ["scope:node", "scope:universal"],
  //             sourceTag: "scope:plugin",
  //           },
  //           {
  //             onlyDependOnLibsWithTags: ["scope:node", "scope:universal"],
  //             sourceTag: "scope:node",
  //           },
  //           {
  //             onlyDependOnLibsWithTags: ["scope:universal"],
  //             sourceTag: "scope:universal",
  //           },
  //         ],
  //         enforceBuildableLibDependency: true,
  //       },
  //     ],
  //   },
  // },
];
