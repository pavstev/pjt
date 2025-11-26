/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import dts from "vite-plugin-dts";
import pkg from "./package.json";
import { generateEntry } from "./src/lib/build-utils";

const nodeVersion = pkg.engines.node.match(/(\d+)/)?.[1] ?? "18";

export default defineConfig({
  plugins: [dts({ tsconfigPath: "tsconfig.build.json" })],
  build: {
    target: `node${nodeVersion}`,
    ssr: true,
    lib: {
      entry: generateEntry(pkg.exports),
      formats: ["cjs"],
      fileName: (_format: string, entryName: string) => `${entryName}.js`,
    },
    outDir: pkg.main.split("/")[1],
    sourcemap: true,
    emptyOutDir: true,
    minify: false,
  },
  test: {
    passWithNoTests: true,
    coverage: {
      provider: "v8",
      clean: true,
      enabled: false,
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts", "src/bin/**"],
      thresholds: {
        lines: 80,
        branches: 80,
      },
    },
    include: ["src/**/*.test.ts"],
  },
});
