import base from "@nx/eslint-plugin";
import { type Config } from "eslint/config";

export const nx: Config[] = [
  ...(base.configs["flat/base"] as Config[]),
  ...(base.configs["flat/typescript"] as Config[]),
  ...(base.configs["flat/javascript"] as Config[]),
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
