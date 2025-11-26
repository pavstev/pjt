import { Tree, readJson, writeJson } from "@nx/devkit";

export default async function (tree: Tree) {
  // Read root package.json
  const rootPackageJson = readJson(tree, "package.json");

  // Props to copy
  const propsToCopy = [
    "author",
    "bugs",
    "homepage",
    "license",
    "name",
    "repository",
    "version",
  ];

  // Get all subdirectories in packages/
  const packageDirs = tree.children("packages");

  // Update each package.json
  for (const dir of packageDirs) {
    const packageJsonPath = `packages/${dir}/package.json`;
    if (tree.exists(packageJsonPath)) {
      const packageJson = readJson(tree, packageJsonPath);

      // Copy the specified props
      for (const prop of propsToCopy) {
        if (rootPackageJson[prop] !== undefined) {
          packageJson[prop] = rootPackageJson[prop];
        }
      }

      // Write back the updated package.json
      writeJson(tree, packageJsonPath, packageJson);
    }
  }
}
