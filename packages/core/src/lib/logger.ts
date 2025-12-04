import consola from "consola";

import type { LogLevel, LogLevelPriorities } from "../types";

const LOG_LEVEL_PRIORITIES: LogLevelPriorities = {
  debug: 0,
  error: 3,
  info: 1,
  warn: 2,
};

export type Logger = {
  debug: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  setLevel: (level: LogLevel) => void;
  warn: (message: string) => void;
};

const getInitialLevel = (): LogLevel => {
  const envLevel = process.env.LOG_LEVEL?.toLowerCase() as LogLevel;
  if (["debug", "error", "info", "warn"].includes(envLevel)) {
    return envLevel;
  }

  return "info";
};

const getLevelPriority = (level: LogLevel): number => {
  return LOG_LEVEL_PRIORITIES[level];
};

export const createLogger = (): Logger => {
  let level: LogLevel = getInitialLevel();

  return {
    debug: (message: string): void => {
      if (getLevelPriority(level) <= 0) {
        consola.debug(message);
      }
    },

    error: (message: string): void => {
      consola.error(message);
    },

    info: (message: string): void => {
      if (getLevelPriority(level) <= 1) {
        consola.info(message);
      }
    },

    setLevel: (newLevel: LogLevel): void => {
      level = newLevel;
    },

    warn: (message: string): void => {
      if (getLevelPriority(level) <= 2) {
        consola.warn(message);
      }
    },
  };
};
