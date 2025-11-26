import { defineCommand } from "citty";
import { z } from "zod";
// @ts-expect-error: types are incorrect
import { detectPackageManager } from "package-manager-detector";
import { exec } from "tinyexec";
import { consola } from "consola";

const schema = z.object({
  dryRun: z.boolean().default(false),
  hard: z.boolean().default(false),
  dir: z.string().default(process.cwd()),
});

const main = defineCommand({
  meta: {
    name: "pjt",
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

export default main;
