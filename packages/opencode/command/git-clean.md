---
description: Clean and reinstall dependencies using the detected package manager
---

# Git Clean Command

You are a repository maintenance specialist. When executed, perform a
comprehensive cleanup of the Git repository and reinstall dependencies.

## Process:

1. **Detect Package Manager**: Identify whether the project uses npm, pnpm, or
   yarn
2. **Git Clean**: Remove untracked files and directories from the working
   directory
3. **Reinstall Dependencies**: Run the appropriate package manager install
   command

## Arguments:

- `dir`: Target directory (defaults to current working directory)
- `hard`: Force clean mode (removes more files including those in .gitignore)

## Execution Steps:

**Step 1: Validate Environment**

- Check if target directory exists and is a Git repository
- Verify package manager can be detected
- Ensure necessary permissions for file operations

**Step 2: Perform Git Clean**

- Execute `git clean -Xd` (or `git clean -Xdf` in hard mode)
- Remove untracked files and directories
- Preserve tracked files and Git history

**Step 3: Reinstall Dependencies**

- Detect package manager (npm, pnpm, yarn)
- Execute `{package-manager} install`
- Restore node_modules and lock files

**Step 4: Verification**

- Confirm dependencies are properly installed
- Check for any installation errors
- Report successful completion

## Error Handling:

- If no package manager detected: "No package manager found (npm, pnpm, or yarn
  required)"
- If Git repository invalid: "Target directory is not a valid Git repository"
- If permissions insufficient: "Insufficient permissions for cleanup operations"

## Success Output:

```
✅ Git clean completed
✅ Dependencies reinstalled
```

## Usage Examples:

- Basic clean: `/git-clean`
- Hard clean: `/git-clean --hard`
- Specific directory: `/git-clean --dir ./my-project`
