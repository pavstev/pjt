import type { GitUrlData } from "./types";

/**
 * Checks if a string is a valid GitHub URL.
 * @param urlString - The URL string to check.
 * @returns True if valid, false otherwise.
 */
export const isValidGithubUrl = (urlString: string): boolean => {
  const regex =
    /^https:\/\/github\.com\/[^/]+\/[^/]+\/(?:tree|blob)\/[^/]+(?:\/.+)?$/;
  return regex.test(urlString);
};

/**
 * Parses a GitHub path URL to extract repository details.
 * @param urlString - The full GitHub URL.
 * @returns Structured object containing repository components.
 */
export const parseGithubUrl = (urlString: string): GitUrlData => {
  const regex =
    /^https:\/\/github\.com\/(?<owner>[^/]+)\/(?<repo>[^/]+)\/(?:tree|blob)\/(?<branch>[^/]+)(?:\/(?<path>.+))?$/;
  const match = urlString.match(regex);

  if (!match?.groups) {
    throw new Error(
      "Could not parse GitHub URL format. Expected: https://github.com/<owner>/<repo>/(tree|blob)/<branch>[/<path>]",
    );
  }

  const { branch, owner, path: folderPath, repo } = match.groups;
  const gitUrl = `https://github.com/${owner}/${repo}.git`;

  return { branch, folderPath: folderPath || ".", gitUrl, owner, repo };
};
