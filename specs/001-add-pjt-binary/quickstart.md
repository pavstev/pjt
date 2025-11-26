# Quickstart: PJT Binary

## Installation

```bash
npm install -g pjt
# or
pnpm add -g pjt
```

## Usage

### Clean a git repository

```bash
pjt pjt
```

### Show help

```bash
pjt --help
```

### Show version

```bash
pjt --version
```

## Examples

In a git repository with untracked files:

```bash
$ pjt pjt
Removed: node_modules/
Removed: .env
Repository cleaned.
```

In a non-git directory:

```bash
$ pjt pjt
Error: Not a git repository
```
