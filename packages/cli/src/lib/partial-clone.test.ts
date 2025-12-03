// eslint-disable-next-line n/no-extraneous-import
import { describe, expect, it } from "vitest";

import { createLogger } from "./logger";
import { partialCloneUrl } from "./partial-clone";

describe("partialCloneUrl", () => {
  it("should be a function", () => {
    expect(typeof partialCloneUrl).toBe("function");
  });

  it("should throw for invalid GitHub URL", () => {
    const logger = createLogger();
    expect(() => partialCloneUrl("invalid", "/tmp/test", logger)).toThrow(
      "Could not parse GitHub URL format",
    );
  });
});
