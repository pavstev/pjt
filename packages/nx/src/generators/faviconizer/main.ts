import { formatFiles, type Tree } from "@nx/devkit";
import favicons from "favicons";
import path from "path";

import { type Schema } from "./schema";

const main = async (tree: Tree, options: Schema): Promise<void> => {
  try {
    const outputDir = options.output || "dist/apps/assets/favicons";

    const result = await favicons(options.input, {
      appDescription: options.appDescription,
      appName: options.appName,
      appShortName: options.appShortName,
      background: options.backgroundColor || "#000000",
      path: "", // Relative paths in manifest
      theme_color: options.themeColor || "#ffffff",
    });

    // Write images
    for (const image of result.images) {
      tree.write(path.join(outputDir, image.name), image.contents);
    }

    // Write files (manifest, etc.)
    for (const file of result.files) {
      tree.write(path.join(outputDir, file.name), file.contents);
    }

    console.log(`Faviconizer generator: Favicons generated successfully`);
  } catch (error) {
    console.error(`Faviconizer generator: Failed to generate favicons:`, error);
    throw error;
  }

  await formatFiles(tree);
};

export default main;
