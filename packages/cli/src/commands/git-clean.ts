import { detectPackageManager } from "@pjt/core";
import { defineCommand } from "citty";
import { consola } from "consola";
import { exec } from "tinyexec";
import { z } from "zod";

const schema = z.object({
  dir: z.string().default(process.cwd()),
  dryRun: z.boolean().default(false),
  hard: z.boolean().default(false),
});

const gitClean = defineCommand({
  args: {
    dir: {
      default: process.cwd(),
      description: "Target directory",
      type: "string",
    },
    dryRun: {
      alias: "d",
      description: "Skip execution, just log",
      type: "boolean",
    },
    hard: {
      alias: "f",
      description: "Force clean",
      type: "boolean",
    },
  },
  meta: {
    description: "Clean and reinstall dependencies",
    name: "git-clean",
  },
  run: async ({ args }) => {
    try {
      const parsed = schema.parse(args);
      const { dir, dryRun, hard } = parsed;
      const pm = await detectPackageManager(dir);
      if (!pm) {
        throw new Error("No package manager detected");
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
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  },
});

export default gitClean;
