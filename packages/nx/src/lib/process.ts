import { execa } from "execa";
import { platform } from "os";

export type ProcessInfo = {
  command: string;
  display: string;
  pid: number;
};

export const getProcesses = async (): Promise<ProcessInfo[]> => {
  const os = platform();

  try {
    if (os === "win32") {
      // Windows: use tasklist
      const result = await execa("tasklist", ["/FO", "CSV", "/NH"]);
      return parseWindowsProcesses(result.stdout);
    }

    // Unix-like systems: use ps
    const result = await execa("ps", ["-eo", "pid,comm"]);
    return parseUnixProcesses(result.stdout);
  } catch (error) {
    // Fallback: try alternative methods
    if (os !== "win32") {
      try {
        const result = await execa("ps", ["aux"]);
        return parsePsAux(result.stdout);
      } catch {
        throw new Error("Unable to list processes");
      }
    }

    throw error;
  }
};

const parseUnixProcesses = (output: string): ProcessInfo[] =>
  output
    .split("\n")
    .slice(1) // Skip header
    .map(line => {
      const parts = line.trim().split(/\s+/);
      const pidStr = parts[0];
      if (parts.length >= 2 && pidStr) {
        const pid = parseInt(pidStr, 10);
        const command = parts.slice(1).join(" ");
        return {
          command,
          display: `${pid}: ${command}`,
          pid,
        };
      }

      return null;
    })
    .filter(
      (proc): proc is ProcessInfo =>
        proc !== null && proc.pid > 0 && proc.pid !== process.pid,
    );

const parseWindowsProcesses = (output: string): ProcessInfo[] =>
  output
    .split("\n")
    .map(line => {
      const parts = line.split('","').map(p => p.replace(/"/g, ""));
      const imageName = parts[0];
      const pidStr = parts[1];
      if (parts.length >= 2 && imageName && pidStr) {
        const pid = parseInt(pidStr, 10);
        return {
          command: imageName,
          display: `${pid}: ${imageName}`,
          pid,
        };
      }

      return null;
    })
    .filter(
      (proc): proc is ProcessInfo =>
        proc !== null && !isNaN(proc.pid) && proc.pid !== process.pid,
    );

const parsePsAux = (output: string): ProcessInfo[] =>
  output
    .split("\n")
    .slice(1) // Skip header
    .map(line => {
      const parts = line.trim().split(/\s+/);
      const pidStr = parts[1];
      if (parts.length >= 11 && pidStr) {
        const pid = parseInt(pidStr, 10);
        const command = parts.slice(10).join(" ");
        return {
          command,
          display: `${pid}: ${command}`,
          pid,
        };
      }

      return null;
    })
    .filter(
      (proc): proc is ProcessInfo =>
        proc !== null && proc.pid > 0 && proc.pid !== process.pid,
    );
