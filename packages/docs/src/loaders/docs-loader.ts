import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";

import { generateGettingStartedPage } from "../generators/getting-started.js";
import { generateIndexPage } from "../generators/index.js";
import { generatePackageGuide } from "../generators/package-guides.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const generateDocsLoader = (): {
  load: (options: {
    logger: { error: (message: string, error: unknown) => void };
    store: { set: (entry: unknown) => void };
  }) => Promise<void>;
  name: string;
} => ({
  load: async ({
    logger,
    store,
  }: {
    logger: { error: (message: string, error: unknown) => void };
    store: { set: (entry: unknown) => void };
  }): Promise<void> => {
    const packagesDir = path.resolve(__dirname, "../../..");
    const packages = fs.readdirSync(packagesDir).filter(dir => {
      const dirPath = path.join(packagesDir, dir);
      return fs.statSync(dirPath).isDirectory() && dir !== "docs";
    });

    // Generate index page
    try {
      const indexContent = await generateIndexPage(packages);
      store.set({
        data: indexContent.data,
        id: "index",
        rendered: {
          html: indexContent.html,
        },
      });
    } catch (error) {
      logger.error("Error generating index:", error);
    }

    // Generate getting-started page
    try {
      const gettingStartedContent = await generateGettingStartedPage();
      store.set({
        data: gettingStartedContent.data,
        id: "getting-started",
        rendered: {
          html: gettingStartedContent.html,
        },
      });
    } catch (error) {
      logger.error("Error generating getting-started:", error);
    }

    // Generate guides for each package
    for (const pkg of packages) {
      try {
        const guideContent = await generatePackageGuide(pkg, packagesDir);
        if (guideContent) {
          console.log(`Setting guides/${pkg} entry`);
          store.set({
            data: guideContent.data,
            id: `guides/${pkg}`,
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
  name: "pjt-docs-loader",
});
