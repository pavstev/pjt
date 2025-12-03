import type { Logger } from "./types";

class ModernLogger implements Logger {
  public debug = (message: string): void => {
    console.log(`🔍 ${message}`);
  };

  public error = (message: string): void => {
    console.error(`✗ ${message}`);
  };

  public info = (message: string): void => {
    console.log(`ℹ ${message}`);
  };

  public success = (message: string): void => {
    console.log(`✓ ${message}`);
  };

  public warn = (message: string): void => {
    console.warn(`⚠ ${message}`);
  };
}

export const createLogger = (): Logger => new ModernLogger();

// Additional logger functions for compatibility
export const error = (message: string): void => {
  createLogger().error(message);
};
export const info = (message: string): void => {
  createLogger().info(message);
};
export const success = (message: string): void => {
  createLogger().success(message);
};
export const warn = (message: string): void => {
  createLogger().warn(message);
};
export const debug = (message: string): void => {
  createLogger().debug(message);
};
