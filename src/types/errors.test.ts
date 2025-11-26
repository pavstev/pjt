import { describe, it, expect } from "vitest";
import { CliError, GitError, FsError, PackageManagerError } from "./errors.js";

describe("CliError", () => {
  it("should create error with message", () => {
    const error = new CliError("Test message");
    expect(error.message).toBe("Test message");
    expect(error.name).toBe("CliError");
    expect(error.code).toBeUndefined();
  });

  it("should create error with message and code", () => {
    const error = new CliError("Test message", "TEST_CODE");
    expect(error.message).toBe("Test message");
    expect(error.name).toBe("CliError");
    expect(error.code).toBe("TEST_CODE");
  });
});

describe("GitError", () => {
  it("should create GitError with correct name and code", () => {
    const error = new GitError("Git failed");
    expect(error.message).toBe("Git failed");
    expect(error.name).toBe("GitError");
    expect(error.code).toBe("GIT_ERROR");
  });
});

describe("FsError", () => {
  it("should create FsError with correct name and code", () => {
    const error = new FsError("FS failed");
    expect(error.message).toBe("FS failed");
    expect(error.name).toBe("FsError");
    expect(error.code).toBe("FS_ERROR");
  });
});

describe("PackageManagerError", () => {
  it("should create PackageManagerError with correct name and code", () => {
    const error = new PackageManagerError("PM failed");
    expect(error.message).toBe("PM failed");
    expect(error.name).toBe("PackageManagerError");
    expect(error.code).toBe("PACKAGE_MANAGER_ERROR");
  });
});
