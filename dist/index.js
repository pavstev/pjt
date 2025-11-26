"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const node_fs = require("node:fs");
const node_path = require("node:path");
const node_child_process = require("node:child_process");
const globifyGitignore = require("globify-gitignore");
const prettierConfig = require("./prettier-config.js");
const eslint = require("@eslint/js");
const prettierConfig$1 = require("eslint-config-prettier");
const eslintPluginJsonSchemaValidator = require("eslint-plugin-json-schema-validator");
const eslintPluginJsonc = require("eslint-plugin-jsonc");
const prettier = require("eslint-plugin-prettier");
const tseslint = require("typescript-eslint");
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
const tsFiles = ["**/*.ts", "**/*.tsx"];
const getIgnores = async () => ({
  ignores: [
    "dist/",
    "node_modules/",
    "**/*.test.ts",
    ...await getIgnorePatterns()
  ]
});
const recommended = eslint.configs.recommended;
const jsonc = eslintPluginJsonc.configs["flat/recommended-with-jsonc"];
const jsonSchema = eslintPluginJsonSchemaValidator.configs["flat/recommended"];
const prettierConf = prettierConfig$1;
const tsRecommended = tseslint.configs.recommended.map(
  (config) => ({
    ...config,
    files: tsFiles
  })
);
const prettierPlugin = {
  files: ["**/*"],
  plugins: {
    prettier
  },
  rules: {
    "prettier/prettier": ["error"]
  }
};
const tsRules = {
  files: tsFiles,
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.ts"]
      }
    }
  },
  rules: {
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "@typescript-eslint/no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "fs",
            message: "Import from 'node:fs' instead"
          },
          {
            name: "path",
            message: "Import from 'node:path' instead"
          },
          {
            name: "child_process",
            message: "Import from 'node:child_process' instead"
          }
        ]
      }
    ],
    "arrow-body-style": ["error", "as-needed"],
    "func-style": ["error", "expression"],
    "no-else-return": "error",
    "no-restricted-syntax": [
      "error",
      {
        selector: "SwitchStatement",
        message: "Switch statements are not allowed"
      },
      {
        selector: "TSInterfaceDeclaration",
        message: "Use type aliases instead of interfaces"
      },
      {
        selector: "ImportNamespaceSpecifier",
        message: "Use explicit imports instead of 'import * as'"
      }
    ]
  }
};
const eslintConfig = async () => {
  const ignores = await getIgnores();
  return [
    ignores,
    recommended,
    ...jsonc,
    ...jsonSchema,
    prettierConf,
    ...tsRecommended,
    prettierPlugin,
    tsRules
  ];
};
const gitCleanCommand = async () => {
  await Promise.all([removeEmptyDirectories("."), gitClean()]);
  await pnpmInstall();
};
exports.prettierConfig = prettierConfig;
exports.eslintConfig = eslintConfig;
exports.execPromise = execPromise;
exports.getIgnorePatterns = getIgnorePatterns;
exports.gitCleanCommand = gitCleanCommand;
//# sourceMappingURL=index.js.map
