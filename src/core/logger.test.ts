import { describe, it, expect, vi, beforeEach } from "vitest";
import { logger } from "./logger.js";

const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

describe("Logger", () => {
  beforeEach(() => {
    logger.setLevel("info");
    consoleLogSpy.mockClear();
    consoleWarnSpy.mockClear();
    consoleErrorSpy.mockClear();
  });
  it("should log info messages at INFO level", () => {
    logger.setLevel("info");
    logger.info("Test info");

    expect(consoleLogSpy).toHaveBeenCalledWith("[INFO] Test info");
  });

  it("should not log info messages below INFO level", () => {
    logger.setLevel("warn");
    logger.info("Test info");

    expect(consoleLogSpy).not.toHaveBeenCalledWith("[INFO] Test info");
  });

  it("should log warn messages at WARN level", () => {
    logger.setLevel("warn");
    logger.warn("Test warn");

    expect(consoleWarnSpy).toHaveBeenCalledWith("[WARN] Test warn");
  });

  it("should not log warn messages at ERROR level", () => {
    logger.setLevel("error");
    logger.warn("Test warn");

    expect(consoleWarnSpy).not.toHaveBeenCalledWith("[WARN] Test warn");
  });

  it("should always log error messages", () => {
    logger.setLevel("error");
    logger.error("Test error");

    expect(consoleErrorSpy).toHaveBeenCalledWith("[ERROR] Test error");
  });

  it("should set level correctly", () => {
    logger.setLevel("warn");
    // Test by checking behavior
    logger.info("Should not log");
    expect(consoleLogSpy).not.toHaveBeenCalledWith("[INFO] Should not log");

    logger.warn("Should log");
    expect(consoleWarnSpy).toHaveBeenCalledWith("[WARN] Should log");
  });
});
