/* eslint-env node */

// eslint-disable-next-line no-undef
module.exports = {
  displayName: "pjt-nx",
  preset: "../../jest.preset.js",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.[tj]s$": [
      "ts-jest",
      { tsconfig: "<rootDir>/tsconfig.spec.json", useESM: true },
    ],
  },
  transformIgnorePatterns: ["<rootDir>/../../packages/prettier/dist/"],
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../coverage/pjt-nx",
};
