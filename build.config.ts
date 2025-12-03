import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["src/main"],
  outDir: "dist",
  rollup: {
    emitCJS: true,
  },
  failOnWarn: false,
});
