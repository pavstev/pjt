import type { Logger } from "./types";

export const createLogger = (): Logger => ({
  debug: (message: string): void => {
    console.log(`🔍 ${message}`);
  },

  error: (message: string): void => {
    console.error(`✗ ${message}`);
  },

  info: (message: string): void => {
    console.log(`ℹ ${message}`);
  },

  success: (message: string): void => {
    console.log(`✓ ${message}`);
  },

  warn: (message: string): void => {
    console.warn(`⚠ ${message}`);
  },
});

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
