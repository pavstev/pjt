import type { defineConfig } from "astro/config";

/// <reference types="astro/client" />
import tailwindcss from "@tailwindcss/vite";

type Plugin = NonNullable<
  NonNullable<Parameters<typeof defineConfig>[0]["vite"]>["plugins"]
>[number];

export const baseAstroConfig: ReturnType<typeof defineConfig> = {
  compressHTML: import.meta.env.PROD,
  outDir: "./dist",

  publicDir: "./public",
  server: {
    host: true,
    port: 4321,
  },
  srcDir: "./src",

  vite: {
    plugins: [tailwindcss() as Plugin],
  },
};
