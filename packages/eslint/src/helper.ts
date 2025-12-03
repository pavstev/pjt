export const withExtensions =
  <
    T extends {
      files?: (string | string[])[];
    },
  >(
    extensions: string[],
  ) =>
  (...configs: T[]): T[] => {
    const files = extensions.map(e => `**/*.${e}`);
    return configs.map(c => ({
      ...c,
      files,
    }));
  };
