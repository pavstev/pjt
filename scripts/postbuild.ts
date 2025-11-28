import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const config =
  require("../dist/prettier.cjs").default ?? require("../dist/prettier.cjs");
writeFileSync("./dist/prettier.json", JSON.stringify(config, null, 2));
