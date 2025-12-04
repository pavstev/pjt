import { defaultConfig } from "../eslint/src";

export default defaultConfig().then(config => [
  ...config,
  {
    ignores: [".astro/content.d.ts"],
  },
]);
