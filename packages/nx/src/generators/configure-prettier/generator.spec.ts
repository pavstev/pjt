import { Tree } from "@nx/devkit";
import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";

import { generator } from "./generator";

jest.mock("@pjt/prettier", () => ({ configure: jest.fn() }));

describe("configure-prettier generator", () => {
  let tree: Tree;
  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it("should run successfully", async () => {
    await expect(generator(tree)).resolves.toBeUndefined();
  });
});
