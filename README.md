# pjt

[![npm version](https://img.shields.io/npm/v/pjt.svg)](https://www.npmjs.com/package/pjt)
[![npm downloads](https://img.shields.io/npm/dm/pjt.svg)](https://www.npmjs.com/package/pjt)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/pjt)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue.svg)](https://www.typescriptlang.org/)
[![CI](https://github.com/pavstev/pjt/workflows/CI/badge.svg)](https://github.com/pavstev/pjt/actions)

> A modern, cross-platform CLI tool that supercharges your development workflow with intelligent npm version management and project maintenance commands.

## ✨ Features

- **📦 Smart NPM Version Management** - Clean old npm versions safely, keeping recent ones
- **⚡ Development Workflow** - Run format, lint, build, test, and knip commands with a single tool
- **🔄 Cross-Platform** - Works seamlessly on Linux, macOS, and Windows
- **🚀 TypeScript First** - Built with TypeScript 5.9+ and strict mode for reliability
- **🛡️ Safe Operations** - Dry-run mode and confirmation prompts prevent accidents
- **🎯 Zero Config** - Works out of the box with sensible defaults
- **🔧 Extensible** - Easy to integrate into existing workflows

## 📦 Installation

### Global (Recommended)

```bash
npm install -g pjt
# or
pnpm add -g pjt
# or
yarn global add pjt
```

### Local (Project-specific)

```bash
npm install --save-dev pjt
# or
pnpm add -D pjt
# or
yarn add -D pjt
```

## 🚀 Quick Start

Clean your Git repository and refresh dependencies:

```bash
cd your-project
pjt
```

That's it! Your repository is now clean and ready for development.

## 📖 Usage

### Core Commands

#### NPM Version Cleanup (Default)

Clean old npm versions, commit changes, and republish:

```bash
pjt
# or explicitly
pjt npm-clean-versions
```

#### Development Workflow

Run common development tasks:

```bash
pjt format    # Format code with Prettier
pjt lint      # Lint with ESLint
pjt build     # Build the project
pjt test      # Run tests with Vitest
pjt knip      # Check for unused dependencies
```

### Command Options

| Option      | Description                       | Example         |
| ----------- | --------------------------------- | --------------- |
| `--dry-run` | Preview changes without executing | `pjt --dry-run` |
| `--help`    | Show help information             | `pjt --help`    |
| `--version` | Show version number               | `pjt --version` |

### Shell Completions

Generate shell completions for better DX:

```bash
# Bash
pjt completions --shell bash >> ~/.bashrc

# Zsh
pjt completions --shell zsh >> ~/.zshrc

# Fish
pjt completions --shell fish > ~/.config/fish/completions/pjt.fish
```

## 🔧 API

Use pjt programmatically in your Node.js applications:

```typescript
import { Git, CliUtils, CommandExecutor, logger } from "pjt";

const git = new Git(logger);
const utils = new CliUtils(logger);
const executor = new CommandExecutor(logger);

// Clean repository programmatically
await git.clean({ dryRun: false });

// Execute npm scripts
await executor.exec("build");
```

### TypeScript Types

```typescript
import type { GitCleanOptions, LogLevel, CommandDefinition } from "pjt";

interface GitCleanOptions {
  exclude?: string[];
  dryRun?: boolean;
}

type LogLevel = "debug" | "info" | "warn" | "error";
```

## ⚙️ Configuration

### Prettier Configuration

Use pjt's battle-tested Prettier config in your projects:

```javascript
// prettier.config.js
module.exports = require("pjt/prettier");
```

```typescript
// prettier.config.ts
import config from "pjt/prettier";
export default config;
```

This config includes:

- TypeScript, JavaScript, JSON, YAML, and Markdown support
- Package.json formatting with `prettier-plugin-packagejson`
- Consistent formatting for VS Code workspace files

## 🤝 Contributing

We welcome contributions! Here's how to get involved:

### Development Setup

```bash
git clone https://github.com/pavstev/pjt.git
cd pjt
pnpm install
pnpm build
pnpm test
```

### Development Commands

```bash
pnpm all        # Run all checks (format, lint, build, typecheck, test, knip)
pnpm format     # Format code
pnpm lint       # Lint code
pnpm typecheck  # Type check
pnpm test       # Run tests
pnpm build      # Build project
```

### Guidelines

- **Code Style**: Follow the existing TypeScript patterns
- **Testing**: Add tests for new features
- **Commits**: Use conventional commits
- **PRs**: Ensure CI passes and add a clear description

## 📄 License

MIT © [Stevan Pavlovic](https://github.com/pavstev)

## 🙏 Acknowledgments

Built with ❤️ using:

- [cac](https://github.com/cacjs/cac) - CLI framework
- [consola](https://github.com/unjs/consola) - Logging
- [simple-git](https://github.com/steveukx/git-js) - Git operations
- [globify-gitignore](https://github.com/mrmlnc/globify-gitignore) - File globbing
