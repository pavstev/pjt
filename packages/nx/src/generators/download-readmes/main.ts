import type { Tree } from "@nx/devkit";

import { logger } from "@nx/devkit";
import https from "https";
import fsSync from "node:fs";
import fs from "node:fs/promises";
import { join } from "node:path";

import type { DownloadReadmesGeneratorSchemaType } from "./schema";

const downloadFile = (url: string, dest: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const file = fsSync.createWriteStream(dest);
    https
      .get(url, response => {
        if (response.statusCode !== 200) {
          reject(
            new Error(`Failed to download ${url}: ${response.statusCode}`),
          );
          return;
        }

        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", err => {
        fs.unlink(dest).catch(() => {
          // Ignore unlink errors
        }); // Delete the file async
        reject(err);
      });
  });

type Config = {
  repositories: string[];
};

const downloadReadmes = async (): Promise<void> => {
  const repoRoot = process.cwd();
  const configPath = join(repoRoot, "docs-crawler.config.json");
  const configData = await fs.readFile(configPath, "utf-8");
  const config = JSON.parse(configData) as Config;
  const cacheDir = join(repoRoot, "node_modules", ".cache", "docs-crawler");
  await fs.mkdir(cacheDir, { recursive: true });

  for (const repoUrl of config.repositories) {
    const [, , , owner, repo] = repoUrl.split("/");
    const repoDir = join(cacheDir, `${owner}-${repo}`);
    await fs.mkdir(repoDir, { recursive: true });
    const readmePath = join(repoDir, "README.md");

    let readmeUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`;
    try {
      await downloadFile(readmeUrl, readmePath);
      logger.info(`Downloaded README for ${owner}/${repo}`);
    } catch {
      readmeUrl = `https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`;
      try {
        await downloadFile(readmeUrl, readmePath);
        logger.info(`Downloaded README for ${owner}/${repo}`);
      } catch {
        logger.warn(`README not found for ${owner}/${repo}`);
      }
    }
  }
};

export const generator = async (
  _tree: Tree,
  _options: DownloadReadmesGeneratorSchemaType,
): Promise<void> => {
  await downloadReadmes();
};
