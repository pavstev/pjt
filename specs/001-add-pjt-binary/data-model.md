# Data Model: Add PJT Binary with Git-Clean Subcommand

## Overview

This feature adds a CLI binary with subcommand architecture. No persistent data storage is required.

## Entities

### CLI Binary

- **Name**: pjt
- **Purpose**: Main executable providing subcommands
- **Attributes**:
  - Version: From package.json
  - Subcommands: Array of available commands (e.g., package-json-tools)
- **Validation**: Must be executable and handle --help

### Git-Clean Subcommand

- **Name**: package-json-tools
- **Purpose**: Cleans git repository by removing untracked files
- **Attributes**:
  - Target directory: Current working directory or specified path
  - Options: None currently
- **Validation**: Only runs in git repositories, provides clear error messages

## Relationships

- Binary contains multiple subcommands
- Subcommands are executed via binary with arguments

## State Transitions

- Binary startup → Parse arguments → Execute subcommand → Exit with status code
