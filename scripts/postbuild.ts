import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const config =
  require("../dist/prettier-config.cjs").default ||
  require("../dist/prettier-config.cjs");
writeFileSync("./dist/prettier-config.json", JSON.stringify(config, null, 2));
