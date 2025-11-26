import { defaultConfig } from "../eslint/src/index.ts";

export default [
  ...defaultConfig(),
  {
    ignores: [".astro/content.d.ts"],
  },
];
