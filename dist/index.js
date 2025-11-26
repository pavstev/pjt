"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const node_fs = require("node:fs");
const node_path = require("node:path");
const node_child_process = require("node:child_process");
const removeEmptyDirectories = async (dir) => {
  const entries = await node_fs.promises.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = node_path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await removeEmptyDirectories(fullPath);
    }
  }
  const remaining = await node_fs.promises.readdir(dir);
  if (remaining.length === 0) {
    await node_fs.promises.rmdir(dir);
  }
};
const execPromise = (command) => new Promise((resolve, reject) => {
  node_child_process.exec(command, (error) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
});
const gitClean = async (exclude = [".env.local"]) => {
  const excludeArgs = exclude.map((e) => `-e ${e}`).join(" ");
  const command = `git clean -Xfd ${excludeArgs}`;
  return execPromise(command);
};
const pnpmInstall = async () => execPromise("pnpm i");
const gitCleanCommand = async () => {
  await Promise.all([removeEmptyDirectories("."), gitClean()]);
  await pnpmInstall();
};
exports.gitCleanCommand = gitCleanCommand;
//# sourceMappingURL=index.js.map
