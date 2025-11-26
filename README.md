# pjt

[![npm version](https://img.shields.io/npm/v/pjt.svg)](https://www.npmjs.com/package/pjt)
[![npm downloads](https://img.shields.io/npm/dm/pjt.svg)](https://www.npmjs.com/package/pjt)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/pjt)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue.svg)](https://www.typescriptlang.org/)
[![CI](https://github.com/pavstev/pjt/workflows/CI/badge.svg)](https://github.com/pavstev/pjt/actions)

> A powerful cross-platform CLI tool for maintaining clean Git repositories. Cleans ignored files and reinstalls dependencies with support for npm, pnpm, yarn, and bun.

## ✨ Features

- **🧹 Git Repository Cleanup** - Clean ignored files and directories from Git repositories
- **📦 Dependency Reinstallation** - Automatically reinstall dependencies using detected package manager
- **⚡ Development Workflow** - Run format, lint, build, test commands with a single tool
- **🔄 Cross-Platform** - Works seamlessly on Linux, macOS, and Windows
- **🚀 TypeScript First** - Built with TypeScript 5.9+ and strict mode for reliability
- **🛡️ Safe Operations** - Dry-run mode prevents accidents
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

That's it! Your repository is now clean and dependencies are reinstalled.

## 📖 Usage

### Core Command

#### Git Repository Cleanup and Dependency Reinstallation (Default)

Clean your Git repository by removing ignored files and reinstall dependencies:

```bash
pjt
```

#### Development Workflow

Run common development tasks:

```bash
pjt format    # Format code with Prettier
pjt lint      # Lint with ESLint
pjt build     # Build the project
pjt test      # Run tests with Vitest
```

### Command Options

| Option         | Description                       | Example               |
| -------------- | --------------------------------- | --------------------- |
| `-d, --dryRun` | Preview changes without executing | `pjt --dryRun`        |
| `-f, --hard`   | Force clean (use -Xdf)            | `pjt --hard`          |
| `--dir`        | Target directory                  | `pjt --dir ./project` |
| `--help`       | Show help information             | `pjt --help`          |
| `--version`    | Show version number               | `pjt --version`       |

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
import main from "pjt";

// Run the CLI programmatically
await main();
```

### TypeScript Types

```typescript
import type { CommandDef } from "citty";
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

- [citty](https://github.com/unjs/citty) - CLI framework
- [consola](https://github.com/unjs/consola) - Logging
- [package-manager-detector](https://github.com/antfu-collective/package-manager-detector) - Package manager detection
- [tinyexec](https://github.com/tinylibs/tinyexec) - Command execution
- [zod](https://github.com/colinhacks/zod) - Schema validation
