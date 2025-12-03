export const getIgnores = async (): Promise<{ ignores: string[] }> => ({
  ignores: ["dist/", "node_modules/", "**/*.test.ts", "**/.astro/"],
});
