export type AnyObject = Record<string, unknown>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FixMe = any;

export const objectEntries = Object.entries as <T>(
  obj: T,
) => [keyof T, T[keyof T]][];

export const objectFromEntries = Object.fromEntries as <T extends AnyObject>(
  entries: [keyof T, T[keyof T]][],
) => T;

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyArray = any[];
