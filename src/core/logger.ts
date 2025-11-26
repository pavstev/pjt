enum LogLevel {
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

class Logger {
  private level: LogLevel = LogLevel.INFO;

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  info(message: string): void {
    if (this.level === LogLevel.INFO) {
      console.log(`[INFO] ${message}`);
    }
  }

  warn(message: string): void {
    if (this.level !== LogLevel.ERROR) {
      console.warn(`[WARN] ${message}`);
    }
  }

  error(message: string): void {
    console.error(`[ERROR] ${message}`);
  }
}

export const logger = new Logger();
