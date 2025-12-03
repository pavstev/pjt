import type { SimpleGit } from "simple-git";

type Commit = {
  hash: string;
  message: string;
};

type FixupPath = {
  targetCommit: Commit | null;
  wipCommits: Commit[];
};

type GitService = {
  commitAmendNoEdit(): Promise<unknown>;
  fetchCommits(limit?: number): Promise<Commit[]>;
  fetchRootCommitHash(): Promise<string>;
  resetSoft(commitHash: string): Promise<unknown>;
};

export const createGitService = (git: SimpleGit): GitService => ({
  commitAmendNoEdit: (): Promise<unknown> =>
    git.commit([
      "--amend",
      "--no-edit",
    ]),
  fetchCommits: async (limit = 20): Promise<Commit[]> => {
    const log = await git.log({
      format: { hash: "%H", message: "%s" },
      maxCount: limit,
    });
    return log.all.map(commit => ({
      hash: commit.hash,
      message: commit.message,
    }));
  },
  fetchRootCommitHash: async (): Promise<string> => {
    const result = await git.revparse([
      "--max-parents=0",
      "HEAD",
    ]);
    return result.trim();
  },
  resetSoft: (commitHash: string): Promise<unknown> =>
    git.reset([
      "--soft",
      commitHash,
    ]),
});

const findFixupPath = (
  commits: Commit[],
  rootCommitHash: string,
): FixupPath => {
  const wipCommits: Commit[] = [];
  let targetCommit: Commit | null = null;

  for (const commit of commits) {
    if (commit.message.toLowerCase().startsWith("wip")) {
      wipCommits.push(commit);
      continue;
    }

    targetCommit = commit;
    break;
  }

  if (wipCommits.length === 0) {
    return { targetCommit: null, wipCommits: [] };
  }

  if (!targetCommit) {
    throw new Error(
      "Only WIP commits found. Cannot proceed without a target commit.",
    );
  }

  if (targetCommit.hash === rootCommitHash) {
    throw new Error(
      "The only available target is the root commit. Aborting to prevent squashing into the initial commit.",
    );
  }

  return { targetCommit, wipCommits: wipCommits.reverse() };
};

const executeFixup = async (
  gitService: GitService,
  fixupPath: Required<FixupPath>,
  dryRun: boolean,
): Promise<void> => {
  if (dryRun) {
    return;
  }

  const { targetCommit } = fixupPath;
  if (!targetCommit) {
    throw new Error("Target commit is null");
  }

  await gitService.resetSoft(targetCommit.hash);
  await gitService.commitAmendNoEdit();
};

export const runFixupWorkflow = async (
  gitService: GitService,
  limit: number,
  dryRun: boolean,
): Promise<boolean> => {
  const [
    commits,
    rootCommitHash,
  ] = await Promise.all([
    gitService.fetchCommits(limit),
    gitService.fetchRootCommitHash(),
  ]);

  const { targetCommit, wipCommits } = findFixupPath(commits, rootCommitHash);

  if (!targetCommit || wipCommits.length === 0) {
    return false;
  }

  await executeFixup(gitService, { targetCommit, wipCommits }, dryRun);
  return true;
};
