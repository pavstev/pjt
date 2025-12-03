import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { generateIndexPage } from '../generators/index.js';
import { generateGettingStartedPage } from '../generators/getting-started.js';
import { generatePackageGuide } from '../generators/package-guides.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const generateDocsLoader = (): { name: string; load: (options: { store: { set: (entry: unknown) => void }; logger: { error: (message: string, error: unknown) => void } }) => Promise<void> } => ({
    name: 'pjt-docs-loader',
    load: async ({ store, logger }: { store: { set: (entry: unknown) => void }; logger: { error: (message: string, error: unknown) => void } }): Promise<void> => {
      const packagesDir = path.resolve(__dirname, '../../..');
      const packages = fs.readdirSync(packagesDir).filter(dir => {
        const dirPath = path.join(packagesDir, dir);
        return fs.statSync(dirPath).isDirectory() && dir !== 'docs';
      });

      // Generate index page
      try {
        const indexContent = await generateIndexPage(packages);
        store.set({
          id: 'index',
          data: indexContent.data,
          rendered: {
            html: indexContent.html,
          },
        });
      } catch (error) {
        logger.error('Error generating index:', error);
      }

      // Generate getting-started page
      try {
        const gettingStartedContent = await generateGettingStartedPage();
        store.set({
          id: 'getting-started',
          data: gettingStartedContent.data,
          rendered: {
            html: gettingStartedContent.html,
          },
        });
      } catch (error) {
        logger.error('Error generating getting-started:', error);
      }

      // Generate guides for each package
      for (const pkg of packages) {
        try {
          const guideContent = await generatePackageGuide(pkg, packagesDir);
          if (guideContent) {
            console.log(`Setting guides/${pkg} entry`);
            store.set({
              id: `guides/${pkg}`,
              data: guideContent.data,
              rendered: {
                html: guideContent.html,
              },
            });
          }
        } catch (error) {
          logger.error(`Error generating guide for ${pkg}:`, error);
        }
      }
    },
  })