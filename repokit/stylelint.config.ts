import type { Config } from "stylelint";
import packageJson from "./package.json" with { type: "json" };

const config: Config = {
  // Extend from all identified configurations
  extends: Object.keys(packageJson.dependencies).filter((dep: string) =>
    dep.includes("stylelint-config"),
  ),

  // Plugins from source files
  plugins: ["stylelint-prettier"],

  // Rules merged from source files
  rules: {
    "order/properties-order": [],
  },

  // Options
  allowEmptyInput: true,
  fix: true,
  cache: true,
  ignoreFiles: ["dist/**"],
};

export default config;
