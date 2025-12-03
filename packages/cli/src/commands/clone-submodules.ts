import { defineCommand } from "citty";
import { mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";

import { createLogger } from "../lib/logger";
import { partialCloneUrl } from "../lib/partial-clone";
import { parseGithubUrl } from "../lib/url";

export const command = defineCommand({
  meta: {
    description: "Clone submodules from submodules.config.json",
    name: "clone-submodules",
  },
  run: async () => {
    const logger = createLogger();
    const configPath = join(process.cwd(), "submodules.config.json");
    const configContent = await readFile(configPath, "utf-8");
    const config = JSON.parse(configContent) as { urls: string[] };

    const cacheDir = "node_modules/.cache/submodules";
    await mkdir(cacheDir, { recursive: true });

    for (const url of config.urls) {
      const urlData = parseGithubUrl(url);
      const repoName = urlData.gitUrl
        .split("/")
        .pop()
        ?.replace(/\.git$/, "");
      if (!repoName) {
        throw new Error(`Invalid git URL: ${urlData.gitUrl}`);
      }

      const destination = join(process.cwd(), "submodules", repoName);
      logger.info(`Cloning ${url} to ${destination}`);
      await partialCloneUrl(url, destination, logger);
    }
  },
});
