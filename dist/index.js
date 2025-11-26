"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitCleanCommand = void 0;
const fs_js_1 = require("./fs.js");
const git_js_1 = require("./git.js");
const package_manager_js_1 = require("./package-manager.js");
const gitCleanCommand = async () => {
    await Promise.all([(0, fs_js_1.removeEmptyDirectories)("."), (0, git_js_1.gitClean)()]);
    await (0, package_manager_js_1.pnpmInstall)();
};
exports.gitCleanCommand = gitCleanCommand;
//# sourceMappingURL=index.js.map