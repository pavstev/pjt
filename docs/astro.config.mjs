import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://pjt.stevanpavlovic.com',
  integrations: [
    starlight({
      title: 'pjt Documentation',
    }),
  ],
});