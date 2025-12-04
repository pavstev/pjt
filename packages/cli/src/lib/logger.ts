// Re-export from core for consistency
export * from "@pjt/core";

// Additional logger functions for compatibility
import { createLogger } from "@pjt/core";

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
