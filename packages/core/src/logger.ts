import consola from "consola";

import type { LogLevel, LogLevelPriorities } from "./types";

const LOG_LEVEL_PRIORITIES: LogLevelPriorities = {
  debug: 0,
  error: 3,
  info: 1,
  warn: 2,
};

export class Logger {
  private level: LogLevel = this.getInitialLevel();

  debug(message: string): void {
    if (this.getLevelPriority(this.level) <= 0) {
      consola.debug(message);
    }
  }

  error(message: string): void {
    consola.error(message);
  }

  info(message: string): void {
    if (this.getLevelPriority(this.level) <= 1) {
      consola.info(message);
    }
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  warn(message: string): void {
    if (this.getLevelPriority(this.level) <= 2) {
      consola.warn(message);
    }
  }

  private getInitialLevel(): LogLevel {
    const envLevel = process.env.LOG_LEVEL?.toLowerCase() as LogLevel;
    if (["debug", "error", "info", "warn"].includes(envLevel)) {
      return envLevel;
    }

    return "info";
  }

  private getLevelPriority(level: LogLevel): number {
    return LOG_LEVEL_PRIORITIES[level];
  }
}
