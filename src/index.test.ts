import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exec } from 'child_process';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { removeEmptyDirectories, gitClean, pnpmInstall, gitCleanCommand } from './index.js';

// Mock child_process.exec
vi.mock('child_process', () => ({
  exec: vi.fn(),
}));

const mockedExec = vi.mocked(exec) as any;

describe('removeEmptyDirectories', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = join(tmpdir(), 'test-git-clean-' + Date.now());
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {}
  });

  it('should remove empty directories', async () => {
    const emptyDir = join(tempDir, 'empty');
    const nestedEmpty = join(emptyDir, 'nested');
    await fs.mkdir(nestedEmpty, { recursive: true });

    await removeEmptyDirectories(tempDir);

    // Check that empty dirs are removed
    try {
      await fs.access(emptyDir);
      expect.fail('Empty directory should be removed');
    } catch {
      // Expected
    }
  });

  it('should not remove directories with files', async () => {
    const dirWithFile = join(tempDir, 'withFile');
    await fs.mkdir(dirWithFile);
    await fs.writeFile(join(dirWithFile, 'file.txt'), 'content');

    await removeEmptyDirectories(tempDir);

    // Should still exist
    await fs.access(dirWithFile);
  });
});

describe('gitClean', () => {
  beforeEach(() => {
    mockedExec.mockClear();
  });

  it('should call git clean with default exclude', async () => {
    mockedExec.mockImplementation((command: string, callback?: (error: any, stdout: string, stderr: string) => void) => {
      if (callback) callback(null, '', '');
    });

    await gitClean();

    expect(mockedExec).toHaveBeenCalledWith('git clean -Xfd -e .env.local', expect.any(Function));
  });

  it('should call git clean with custom excludes', async () => {
    mockedExec.mockImplementation((command: string, callback?: (error: any, stdout: string, stderr: string) => void) => {
      if (callback) callback(null, '', '');
    });

    await gitClean(['.env', 'node_modules']);

    expect(mockedExec).toHaveBeenCalledWith('git clean -Xfd -e .env -e node_modules', expect.any(Function));
  });

  it('should reject on error', async () => {
    mockedExec.mockImplementation((command: string, callback?: (error: any, stdout: string, stderr: string) => void) => {
      if (callback) callback(new Error('git error'), '', '');
    });

    await expect(gitClean()).rejects.toThrow('git error');
  });
});

describe('pnpmInstall', () => {
  beforeEach(() => {
    mockedExec.mockClear();
  });

  it('should call pnpm i', async () => {
    mockedExec.mockImplementation((command: string, callback?: (error: any, stdout: string, stderr: string) => void) => {
      if (callback) callback(null, '', '');
    });

    await pnpmInstall();

    expect(mockedExec).toHaveBeenCalledWith('pnpm i', expect.any(Function));
  });

  it('should reject on error', async () => {
    mockedExec.mockImplementation((command: string, callback?: (error: any, stdout: string, stderr: string) => void) => {
      if (callback) callback(new Error('pnpm error'), '', '');
    });

    await expect(pnpmInstall()).rejects.toThrow('pnpm error');
  });
});

describe('gitCleanCommand', () => {
  beforeEach(() => {
    mockedExec.mockClear();
  });

  it('should call all functions in sequence', async () => {
    mockedExec.mockImplementation((command: string, callback?: (error: any, stdout: string, stderr: string) => void) => {
      if (callback) callback(null, '', '');
    });

    // Mock fs operations for removeEmptyDirectories
    const originalReaddir = fs.readdir;
    const originalRmdir = fs.rmdir;
    fs.readdir = vi.fn().mockResolvedValue([]);
    fs.rmdir = vi.fn().mockResolvedValue(undefined);

    await gitCleanCommand();

    expect(mockedExec).toHaveBeenCalledWith('git clean -Xfd -e .env.local', expect.any(Function));
    expect(mockedExec).toHaveBeenCalledWith('pnpm i', expect.any(Function));

    // Restore
    fs.readdir = originalReaddir;
    fs.rmdir = originalRmdir;
  });
});