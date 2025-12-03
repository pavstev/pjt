import { defineCommand } from "citty";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";

import { createLogger } from "../lib/logger";

const getMdFiles = async (dir: string, baseDir: string): Promise<string[]> => {
  const files: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getMdFiles(fullPath, baseDir)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(`instructions/${relative(baseDir, fullPath)}`);
    }
  }

  return files;
};

export const command = defineCommand({
  meta: {
    description:
      "Regenerate the instructions field in opencode.json by traversing instructions/",
    name: "regenerate-instructions",
  },
  run: async () => {
    const logger = createLogger();
    const opencodeDir = join(process.cwd(), ".opencode");
    const instructionsDir = join(opencodeDir, "instructions");
    const configPath = join(opencodeDir, "opencode.json");

    logger.info("Collecting .md files from instructions directory...");
    const mdFiles = await getMdFiles(instructionsDir, opencodeDir);

    logger.info(`Found ${mdFiles.length} .md files`);

    const configContent = await readFile(configPath, "utf-8");

    const config = JSON.parse(configContent);

    config.instructions = mdFiles.sort();

    await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`);

    logger.info("Updated instructions in opencode.json");
  },
});
