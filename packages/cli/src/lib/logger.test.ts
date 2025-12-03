// eslint-disable-next-line n/no-extraneous-import
import { describe, expect, it, vi } from "vitest";

import { createLogger } from "./logger";

describe("createLogger", () => {
  it("should create a logger with info and error methods", () => {
    const logger = createLogger();
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.error).toBe("function");
  });

  it("should log info messages", () => {
    const logger = createLogger();
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
      // Mock implementation
    });
    logger.info("test message");
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith("ℹ test message");
    consoleSpy.mockRestore();
  });

  it("should log error messages", () => {
    const logger = createLogger();
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {
      // Mock implementation
    });
    logger.error("test error");
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith("✗ test error");
    consoleSpy.mockRestore();
  });
});
