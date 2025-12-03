import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightAutoSidebar from "starlight-auto-sidebar";

import pkg from "../../package.json" with { type: "json" };

export default defineConfig({
  integrations: [
    starlight({
      customCss: [
        "@fontsource/geist-sans/400.css",
        "@fontsource/geist-sans/600.css",
        "@fontsource/geist-mono/400.css",
        "@fontsource/geist-mono/100.css",
      ],
      defaultLocale: "root",
      description: pkg.description,
      locales: {
        root: {
          label: "English",
          lang: "en",
        },
      },
      plugins: [starlightAutoSidebar({})],
      title: pkg.name,
    }),
  ],
  site: pkg.homepage,
});
