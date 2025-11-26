"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitCleanCommand = exports.pnpmInstall = exports.gitClean = exports.removeEmptyDirectories = void 0;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const path_1 = require("path");
const execPromise = (command) => new Promise((resolve, reject) => {
    (0, child_process_1.exec)(command, (error) => {
        if (error) {
            reject(error);
        }
        else {
            resolve();
        }
    });
});
const removeEmptyDirectories = async (dir) => {
    const entries = await fs_1.promises.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = (0, path_1.join)(dir, entry.name);
        if (entry.isDirectory()) {
            await (0, exports.removeEmptyDirectories)(fullPath);
        }
    }
    // After processing subdirs, check if current dir is empty
    const remaining = await fs_1.promises.readdir(dir);
    if (remaining.length === 0) {
        await fs_1.promises.rmdir(dir);
    }
};
exports.removeEmptyDirectories = removeEmptyDirectories;
const gitClean = async (exclude = [".env.local"]) => {
    const excludeArgs = exclude.map(e => `-e ${e}`).join(" ");
    const command = `git clean -Xfd ${excludeArgs}`;
    return execPromise(command);
};
exports.gitClean = gitClean;
const pnpmInstall = async () => execPromise("pnpm i");
exports.pnpmInstall = pnpmInstall;
const gitCleanCommand = async () => {
    await Promise.all([(0, exports.removeEmptyDirectories)("."), (0, exports.gitClean)()]);
    await (0, exports.pnpmInstall)();
};
exports.gitCleanCommand = gitCleanCommand;
//# sourceMappingURL=index.js.map