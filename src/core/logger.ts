type LogLevel = "info" | "warn" | "error";

class Logger {
  private level: LogLevel = "info";

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  private getLevelPriority(level: LogLevel): number {
    const priorities: Record<LogLevel, number> = {
      info: 0,
      warn: 1,
      error: 2,
    };
    return priorities[level];
  }

  info(message: string): void {
    if (this.getLevelPriority(this.level) <= 0) {
      console.log(`[INFO] ${message}`);
    }
  }

  warn(message: string): void {
    if (this.getLevelPriority(this.level) <= 1) {
      console.warn(`[WARN] ${message}`);
    }
  }

  error(message: string): void {
    console.error(`[ERROR] ${message}`);
  }
}

export const logger = new Logger();
