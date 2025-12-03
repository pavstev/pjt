export type GitUrlData = {
  branch: string;
  folderPath: string;
  gitUrl: string;
  owner: string;
  repo: string;
};

export type Logger = {
  debug: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  success: (message: string) => void;
  warn: (message: string) => void;
};
