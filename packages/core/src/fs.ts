import { globifyGitIgnore } from "globify-gitignore";
import { promises as fs, readdirSync } from "node:fs";
import { join } from "node:path";
import { Logger } from "./logger";
import { CliError, CliErrorMessages } from "./types";

export class FileSystem {
  constructor(private logger: Logger) {}

  async validateDirectory(dir: string): Promise<void> {
    if (!dir || typeof dir !== "string") {
      throw new CliError(CliErrorMessages.INVALID_DIRECTORY_PATH);
    }
    try {
      const stat = await fs.stat(dir);
      if (!stat.isDirectory()) {
        throw new CliError(
          CliErrorMessages.NOT_A_DIRECTORY_TEMPLATE.replace("%s", dir),
        );
      }
    } catch (error) {
      if (error instanceof CliError) throw error;
      throw new CliError(
        CliErrorMessages.DIRECTORY_NOT_ACCESSIBLE_TEMPLATE.replace("%s", dir),
        {
          cause: error,
        },
      );
    }
  }

  async removeEmptyDirectories(dir: string): Promise<void> {
    await this.validateDirectory(dir);
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (!entry.isDirectory()) continue;
        await this.removeEmptyDirectories(fullPath);
      }
      // After processing subdirs, check if current dir is empty
      const remaining = await fs.readdir(dir);
      if (remaining.length === 0) {
        this.logger.info(`Removing empty directory: ${dir}`);
        await fs.rmdir(dir);
      }
    } catch (error) {
      this.logger.error(
        `Failed to remove empty directories in ${dir}: ${error}`,
      );
      throw new CliError(
        CliErrorMessages.FAILED_TO_PROCESS_DIRECTORY_TEMPLATE.replace(
          "%s",
          dir,
        ),
        { cause: error },
      );
    }
  }

  async getIgnorePatterns(): Promise<string[]> {
    try {
      const directory = process.cwd();
      const files = readdirSync(".", {
        encoding: "utf8",
        recursive: false,
      }).filter((file: string) => /^\..(\w+)ignore$/.test(file));

      const entries = await Promise.all(
        files.map(async (file: string) => {
          try {
            const entries = await globifyGitIgnore(
              join(directory, file),
              directory,
              true,
            );
            return entries.filter(e => e.included).map(e => e.glob);
          } catch (error) {
            this.logger.warn(`Failed to parse ignore file ${file}: ${error}`);
            return [];
          }
        }),
      );

      return entries.flat();
    } catch (error) {
      this.logger.error(`Failed to read ignore patterns: ${error}`);
      throw new CliError(CliErrorMessages.FAILED_TO_READ_IGNORE_PATTERNS, {
        cause: error,
      });
    }
  }
}
