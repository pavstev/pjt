# CLI Contract: PJT Binary

## Overview

The `pjt` binary provides a command-line interface for package.json tools, starting with pjt functionality.

## Commands

### pjt --help

- **Description**: Display help information
- **Arguments**: None
- **Output**: List of available subcommands and options
- **Exit Code**: 0

### pjt --version

- **Description**: Display version
- **Arguments**: None
- **Output**: Version string from package.json
- **Exit Code**: 0

### pjt pjt

- **Description**: Clean git repository
- **Arguments**: None
- **Options**:
  - --dry-run: Show what would be removed without deleting
- **Output**: List of removed files/directories
- **Exit Code**: 0 on success, 1 on error (not a git repo, permission issues)
- **Errors**:
  - "Not a git repository" if no .git directory
  - "Permission denied" if cannot remove files

## Error Handling

All errors output to stderr with descriptive messages.
Exit codes follow Unix conventions: 0 success, 1 error.
