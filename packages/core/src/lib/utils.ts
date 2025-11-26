import { execSync } from "node:child_process";

/**
 * Utility functions for common operations
 */

/**
 * Check if a command exists in PATH
 * @param command - The command to check
 * @returns True if command exists
 */
export const commandExists = (command: string): boolean => {
  try {
    execSync(`which ${command}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
};

/**
 * Check if current directory is a git repository
 * @returns True if in a git repo
 */
export const isGitRepository = (): boolean => {
  try {
    execSync("git rev-parse --git-dir", {
      cwd: process.cwd(),
      stdio: "ignore",
    });
    return true;
  } catch {
    return false;
  }
};

/**
 * Typed version of Object.entries
 */
export const objectEntries = Object.entries as <T>(
  obj: T,
) => [keyof T & string, T[keyof T]][];

/**
 * Typed version of Object.fromEntries
 */
export const objectFromEntries = Object.fromEntries as <
  T extends Record<string, unknown>,
>(
  entries: [keyof T, T[keyof T]][],
) => T;

/**
 * Create an object from an array of keys and a value resolver
 */
export const objectFromArray = <K extends number | string | symbol, V>(
  arr: [K, ...K[]],
  resolveValue: (key: K) => V,
): Record<K, V> => {
  const result = {} as Record<K, V>;

  for (const key of arr) {
    result[key] = resolveValue(key);
  }

  return result;
};

/**
 * Ensure a value is an array
 */
export const ensureArray = <T>(arrayLike: T | T[]): T[] =>
  Array.isArray(arrayLike) ? arrayLike : [arrayLike];

/**
 * Measure execution time of a function
 */
export const measureExecutionTime = <T>(
  fn: () => T,
): { result: T; duration: number } => {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;
  return { result, duration };
};

/**
 * Memoize a function
 */
export const memoize = <Args extends readonly unknown[], Return>(
  fn: (...args: Args) => Return,
): ((...args: Args) => Return) => {
  const cache = new Map<string, Return>();
  return (...args: Args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key) as Return;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};
