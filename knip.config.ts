import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: ["src/bin/*.ts"],
  project: ["src/**/*"],
  ignore: ["dist/**", ".specify/**"],
};

export default config;
