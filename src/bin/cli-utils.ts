import { promises as fs } from "node:fs";

export const checkGitRepository = async (): Promise<void> => {
  try {
    await fs.access(".git");
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      throw new Error("Not a git repository");
    }
    throw error;
  }
};

export const handleError = (error: unknown): never => {
  if (error instanceof Error) {
    console.error("Error:", error.message);
  } else {
    console.error("Error:", String(error));
  }
  process.exit(1);
};
