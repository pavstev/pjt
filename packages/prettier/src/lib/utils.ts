import type { ConfigOverrides } from "../schema/schema";

const createOverrideKey = (override: ConfigOverrides): string =>
  `${override.files.sort().join(",")}-${override.excludeFiles?.sort().join(",") ?? ""}`;

export const deduplicateOverrides = (
  overrides: ConfigOverrides[],
): ConfigOverrides[] => {
  const seen = new Map<string, ConfigOverrides>();

  for (const override of overrides) {
    const key = createOverrideKey(override);
    if (!seen.has(key)) {
      seen.set(key, { ...override });
    } else {
      const existing = seen.get(key)!;
      existing.options = { ...existing.options, ...override.options };
    }
  }

  return Array.from(seen.values());
};
