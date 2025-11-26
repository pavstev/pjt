"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeEmptyDirectories = removeEmptyDirectories;
exports.gitClean = gitClean;
exports.pnpmInstall = pnpmInstall;
exports.gitCleanCommand = gitCleanCommand;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const path_1 = require("path");
async function removeEmptyDirectories(dir) {
    const entries = await fs_1.promises.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = (0, path_1.join)(dir, entry.name);
        if (entry.isDirectory()) {
            await removeEmptyDirectories(fullPath);
        }
    }
    // After processing subdirs, check if current dir is empty
    const remaining = await fs_1.promises.readdir(dir);
    if (remaining.length === 0) {
        await fs_1.promises.rmdir(dir);
    }
}
async function gitClean(exclude = ['.env.local']) {
    const excludeArgs = exclude.map(e => `-e ${e}`).join(' ');
    const command = `git clean -Xfd ${excludeArgs}`;
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            else {
                resolve();
            }
        });
    });
}
async function pnpmInstall() {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)('pnpm i', (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            else {
                resolve();
            }
        });
    });
}
async function gitCleanCommand() {
    await removeEmptyDirectories('.');
    await gitClean();
    await pnpmInstall();
}
//# sourceMappingURL=index.js.map