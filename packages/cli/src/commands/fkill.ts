import { defineCommand } from "citty";
import inquirer from "inquirer";

import { error } from "../lib/logger";
import { getProcesses } from "../lib/process";

type ProcessInfo = {
  command: string;
  display: string;
  pid: number;
};

const killProcesses = (pids: number[]): void => {
  for (const pid of pids) {
    try {
      process.kill(pid, "SIGKILL");
      console.log(`Killed process: ${pid}`);
    } catch (killError: unknown) {
      const message =
        killError instanceof Error ? killError.message : String(killError);
      error(`Failed to kill process ${pid}: ${message}`);
    }
  }
};

export const command = defineCommand({
  meta: {
    description: "Interactively kill processes",
    name: "fkill",
  },
  run: async () => {
    const processes = await getProcesses();

    if (processes.length === 0) {
      console.log("No processes found");
      return;
    }

    const choices = processes.map((proc: ProcessInfo) => ({
      name: `${proc.pid}: ${proc.command}`,
      value: proc.pid,
    }));

    const answers = await inquirer.prompt<{ selectedPids: number[] }>([
      {
        choices,
        message: "Select processes to kill:",
        name: "selectedPids",
        pageSize: 20,
        type: "checkbox",
      },
    ]);

    if (answers.selectedPids.length > 0) {
      killProcesses(answers.selectedPids);
    }
  },
});
