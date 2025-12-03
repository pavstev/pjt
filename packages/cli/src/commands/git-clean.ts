import { detectPackageManager } from "@pjt/core";
import { defineCommand } from "citty";
import { consola } from "consola";
import { exec } from "tinyexec";
import { z } from "zod";

const schema = z.object({
  dryRun: z.boolean().default(false),
  hard: z.boolean().default(false),
  dir: z.string().default(process.cwd()),
});

const gitClean = defineCommand({
  meta: {
    name: "git-clean",
    description: "Clean and reinstall dependencies",
  },
  args: {
    dryRun: {
      type: "boolean",
      alias: "d",
      description: "Skip execution, just log",
    },
    hard: {
      type: "boolean",
      alias: "f",
      description: "Force clean",
    },
    dir: {
      type: "string",
      description: "Target directory",
      default: process.cwd(),
    },
  },
  async run({ args }) {
    try {
      const parsed = schema.parse(args);
      const { dryRun, hard, dir } = parsed;
      const pm = await detectPackageManager(dir);
      if (!pm) {
        consola.error("No package manager detected");
        process.exit(1);
      }
      const cleanFlags = hard ? "-Xdf" : "-Xd";
      const cleanCmd = `git clean ${cleanFlags}`;
      if (dryRun) {
        consola.info(`Would run: ${cleanCmd}`);
      } else {
        // @ts-expect-error: types are incorrect
        await exec(cleanCmd, { cwd: dir });
        consola.success("Git clean completed");
      }
      const installCmd = `${pm.name} install`;
      if (dryRun) {
        consola.info(`Would run: ${installCmd}`);
      } else {
        // @ts-expect-error: types are incorrect
        await exec(installCmd, { cwd: dir });
        consola.success("Dependencies reinstalled");
      }
    } catch (error) {
      consola.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  },
});

export default gitClean;
