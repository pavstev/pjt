import type { Config } from "jest";

module.exports = {
  displayName: "prettier",
  preset: "../../jest.preset.js",
  coverageDirectory: "../../coverage/packages/prettier",
  passWithNoTests: true,
} satisfies Config;
