import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import starlightAutoSidebar from 'starlight-auto-sidebar';
import pkg from '../../package.json' with { type: 'json' };

export default defineConfig({
  site: pkg.homepage,
  integrations: [
    starlight({
      title: pkg.name,
      description: pkg.description,
      defaultLocale: 'root',
      locales: {
        root: {
          label: "English",
          lang: "en"
        },
      },
      customCss: [
        '@fontsource/geist-sans/400.css',
        '@fontsource/geist-sans/600.css',
        '@fontsource/geist-mono/400.css',
        '@fontsource/geist-mono/100.css',
      ],
       plugins: [
          starlightAutoSidebar({

          }),
        ],
      }),
   ],
});