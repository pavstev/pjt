import { defineConfig } from "vitest/config";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts({ tsconfigPath: "tsconfig.build.json" })],
  build: {
    target: "node18",
    ssr: true,
    lib: {
      entry: {
        index: "src/index.ts",
        "bin/pjt": "src/bin/pjt.ts",
        "prettier-config": "src/config/prettier-config.ts",
        "eslint-config": "src/config/eslint-config.ts",
      },
      formats: ["cjs"],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    outDir: "dist",
    sourcemap: true,
    emptyOutDir: true,
    minify: false,
  },
  test: {
    coverage: {
      provider: "v8",
      clean: true,
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
