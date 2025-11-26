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
      include: ["src/**/*.test.ts"],
      thresholds: {
        "100": true,
      },
    },
    include: ["src/**/*.test.ts"],
  },
});
