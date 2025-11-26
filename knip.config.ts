import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: ["src/bin/*.ts", "src/index.ts"],
  project: ["src/**/*", "tests/**/*"],
  ignore: ["dist/**", ".specify/**"],
};

export default config;
