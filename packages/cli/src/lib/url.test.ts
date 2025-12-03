// eslint-disable-next-line n/no-extraneous-import
import { describe, expect, it } from "vitest";

import { isValidGithubUrl, parseGithubUrl } from "./url";

describe("url utilities", () => {
  describe("parseGithubUrl", () => {
    it("should parse a valid GitHub URL", () => {
      const url = "https://github.com/owner/repo/tree/main/path";
      const parsed = parseGithubUrl(url);
      expect(parsed.owner).toBe("owner");
      expect(parsed.repo).toBe("repo");
      expect(parsed.branch).toBe("main");
      expect(parsed.folderPath).toBe("path");
      expect(parsed.gitUrl).toBe("https://github.com/owner/repo.git");
    });

    it("should parse URL without path", () => {
      const url = "https://github.com/owner/repo/tree/main";
      const parsed = parseGithubUrl(url);
      expect(parsed.folderPath).toBe(".");
    });

    it("should throw for invalid GitHub URL", () => {
      expect(() => parseGithubUrl("invalid")).toThrow();
      expect(() => parseGithubUrl("https://example.com")).toThrow();
    });
  });

  describe("isValidGithubUrl", () => {
    it("should return true for valid GitHub URLs", () => {
      expect(isValidGithubUrl("https://github.com/owner/repo/tree/main")).toBe(
        true,
      );
      expect(
        isValidGithubUrl("https://github.com/owner/repo/blob/main/file"),
      ).toBe(true);
    });

    it("should return false for invalid URLs", () => {
      expect(isValidGithubUrl("invalid")).toBe(false);
      expect(isValidGithubUrl("https://example.com")).toBe(false);
      expect(isValidGithubUrl("")).toBe(false);
    });
  });
});
