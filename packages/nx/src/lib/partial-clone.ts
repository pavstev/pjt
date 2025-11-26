import { readFile, rename, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { simpleGit } from "simple-git";

import type { GitUrlData } from "./types";

import type { Logger } from "@pjt/core";
import { createTempDir, pathExists } from "./fs";
import { parseGithubUrl } from "./url";

const setupSparseCheckout = async (
  repoDir: string,
  folderPath: string,
  branch: string,
  logger: Logger,
): Promise<void> => {
  const repo = simpleGit(repoDir);
  logger.info(`> git -C ${repoDir} config core.sparseCheckout true`);
  await repo.addConfig("core.sparseCheckout", "true");
  logger.info(`> git -C ${repoDir} sparse-checkout init`);
  await repo.raw(["sparse-checkout", "init"]);
  logger.info(
    `> git -C ${repoDir} sparse-checkout set --no-cone "/${folderPath}"`,
  );
  await repo.raw(["sparse-checkout", "set", "--no-cone", `/${folderPath}`]);
  logger.info(`> git -C ${repoDir} checkout ${branch}`);
  await repo.checkout(branch);
};

const checkCacheJson = async (
  destinationPath: string,
  logger: Logger,
): Promise<boolean> => {
  const cacheFilePath = join(destinationPath, ".cache.json");
  if (
    !((await pathExists(destinationPath)) && (await pathExists(cacheFilePath)))
  ) {
    return false;
  }

  try {
    const content = await readFile(cacheFilePath, "utf-8");
    const data = JSON.parse(content) as { lastClonedAt?: number | string };
    if (
      data.lastClonedAt &&
      typeof data.lastClonedAt === "string" &&
      !isNaN(new Date(data.lastClonedAt).getTime())
    ) {
      logger.info("Using cached version based on .cache.json");
      return true;
    }
  } catch {
    // no-op
  }

  return false;
};

const performClone = async (
  urlData: GitUrlData,
  destinationPath: string,
  logger: Logger,
): Promise<void> => {
  const { branch, folderPath, gitUrl } = urlData;

  const tempDir = await createTempDir("partial-clone-");
  logger.info(`Starting partial clone operation...`);
  logger.info(`  Repository: ${gitUrl}`);
  logger.info(`  Branch: ${branch}`);
  logger.info(`  Path: ${folderPath}`);
  logger.info(`  Destination: ${destinationPath}`);
  logger.info(`  Temp Dir: ${tempDir}`);
  logger.info("");

  const git = simpleGit();
  logger.info(`> git clone --depth 1 --no-checkout ${gitUrl} ${tempDir}`);
  await git.clone(gitUrl, tempDir, ["--depth", "1", "--no-checkout"]);

  await setupSparseCheckout(tempDir, folderPath, branch, logger);

  const sourcePathInTemp = join(tempDir, folderPath);
  if (!(await pathExists(sourcePathInTemp))) {
    throw new Error(
      `The specified path '${folderPath}' does not exist on branch '${branch}' or is not a directory.`,
    );
  }

  if (await pathExists(destinationPath)) {
    await rm(destinationPath, { force: true, recursive: true });
  }

  await rename(sourcePathInTemp, destinationPath);

  await writeFile(
    join(destinationPath, ".cache.json"),
    JSON.stringify({ lastClonedAt: new Date().toISOString() }),
    "utf-8",
  );

  logger.info("");
  logger.info(
    `Successfully cloned '${folderPath}' from branch '${branch}' to '${destinationPath}'.`,
  );

  await rm(tempDir, { force: true, recursive: true });
};

/**
 * The main logic to perform the partial clone using Git's sparse checkout.
 * @param urlData - Structured data parsed from the GitHub URL.
 * @param destinationPath - The local folder path to save the contents to.
 * @param logger - The logger dependency.
 */
const partialClone = async (
  urlData: GitUrlData,
  destinationPath: string,
  logger: Logger,
): Promise<void> => {
  if (await checkCacheJson(destinationPath, logger)) {
    return;
  }

  await performClone(urlData, destinationPath, logger);
};

/**
 * Partially clones a GitHub URL to a destination path.
 * @param githubUrl - The GitHub URL to clone from.
 * @param destinationPath - The destination path.
 * @param logger - The logger dependency.
 * @returns Promise that resolves when cloning is complete
 */
export const partialCloneUrl = (
  githubUrl: string,
  destinationPath: string,
  logger: Logger,
): Promise<void> => {
  const urlData = parseGithubUrl(githubUrl);
  return partialClone(urlData, destinationPath, logger);
};
