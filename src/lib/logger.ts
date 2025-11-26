import consola from "consola";
import { LogLevel } from "./types";

export class Logger {
  private level: LogLevel = this.getInitialLevel();

  private getInitialLevel(): LogLevel {
    const envLevel = process.env.LOG_LEVEL?.toLowerCase() as LogLevel;
    if (["debug", "info", "warn", "error"].includes(envLevel)) {
      return envLevel;
    }
    return "info";
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  private getLevelPriority(level: LogLevel): number {
    const priorities: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };
    return priorities[level];
  }

  debug(message: string): void {
    if (this.getLevelPriority(this.level) <= 0) {
      consola.debug(message);
    }
  }

  info(message: string): void {
    if (this.getLevelPriority(this.level) <= 1) {
      consola.info(message);
    }
  }

  warn(message: string): void {
    if (this.getLevelPriority(this.level) <= 2) {
      consola.warn(message);
    }
  }

  error(message: string): void {
    consola.error(message);
  }
}

export const logger = new Logger();
