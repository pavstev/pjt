"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const node_fs = require("node:fs");
const node_path = require("node:path");
const node_child_process = require("node:child_process");
const globifyGitignore = require("globify-gitignore");
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
const getIgnorePatterns = async () => {
  const directory = process.cwd();
  const entries = await Promise.all(
    node_fs.readdirSync(".", {
      encoding: "utf8",
      recursive: false
    }).filter((file) => /^\..(\w+)ignore$/.test(file)).map(async (file) => {
      const entries2 = await globifyGitignore.globifyGitIgnore(
        node_path.join(directory, file),
        directory,
        true
      );
      return entries2.filter((e) => e.included).map((e) => e.glob);
    })
  );
  return entries.flat();
};
const gitClean = async (exclude = [".env.local"]) => {
  const excludeArgs = exclude.map((e) => `-e ${e}`).join(" ");
  const command = `git clean -Xfd ${excludeArgs}`;
  return execPromise(command);
};
const pnpmInstall = async () => execPromise("pnpm i");
const config = {
  arrowParens: "avoid",
  overrides: [
    {
      files: "*.jsonc",
      options: {
        trailingComma: "all"
      }
    },
    {
      files: "*.code-workspace",
      options: {
        parser: "jsonc",
        trailingComma: "all"
      }
    },
    {
      files: ["*.json", "!package.json", "!**/package.json"],
      options: {
        parser: "json",
        plugins: ["prettier-plugin-tailwindcss"]
      }
    },
    {
      files: ["package.json", "**/package.json"],
      options: {
        parser: "json-stringify",
        plugins: ["prettier-plugin-packagejson"]
      }
    },
    {
      files: ["*.md", "**/*.md"],
      options: {
        parser: "markdown"
      }
    },
    {
      files: ["*.yaml", "*.yml", "**/*.yaml", "**/*.yml"],
      options: {
        parser: "yaml"
      }
    },
    {
      files: ["*.ts", "**/*.ts"],
      options: {
        parser: "typescript"
      }
    },
    {
      files: ["*.js", "**/*.js"],
      options: {
        parser: "babel"
      }
    }
  ],
  plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-packagejson"]
};
const gitCleanCommand = async () => {
  await Promise.all([removeEmptyDirectories("."), gitClean()]);
  await pnpmInstall();
};
exports.getIgnorePatterns = getIgnorePatterns;
exports.gitCleanCommand = gitCleanCommand;
exports.prettierConfig = config;
//# sourceMappingURL=index.js.map
