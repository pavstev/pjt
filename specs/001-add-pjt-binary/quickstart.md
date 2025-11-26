# Quickstart: PJT Binary

## Installation

```bash
npm install -g @pavstev/package-json-tools
# or
pnpm add -g @pavstev/package-json-tools
```

## Usage

### Clean a git repository

```bash
pjt package-json-tools
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
$ pjt package-json-tools
Removed: node_modules/
Removed: .env
Repository cleaned.
```

In a non-git directory:

```bash
$ pjt package-json-tools
Error: Not a git repository
```
