# pjt

[![npm version](https://badge.fury.io/js/%40pavstev%2Fpackage-json-tools.svg)](https://badge.fury.io/js/%40pavstev%2Fpackage-json-tools)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue.svg)](https://www.typescriptlang.org/)

A powerful, cross-platform CLI tool for managing and cleaning Git repositories, with specialized focus on package.json workflows and dependency management.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [API](#api)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## Features

- **🧹 Git Repository Cleaning**: Intelligently remove untracked files, empty directories, and cache folders
- **📦 Dependency Management**: Automatic reinstallation of dependencies after cleaning
- **🔄 Cross-Platform**: Seamless operation on Linux, macOS, and Windows
- **⚡ TypeScript Built**: Fully typed with strict mode for maximum reliability
- **🛠️ Extensible CLI**: Modular command structure for easy extension
- **🚀 Fast Execution**: Optimized performance with minimal overhead
- **📋 Package Manager Support**: Works with npm, pnpm, and yarn
- **🔒 Safe Operations**: Dry-run modes and confirmation prompts for destructive actions

## Installation

### Global Installation

Install globally via npm:

```bash
npm install -g @pavstev/package-json-tools
```

Or with pnpm:

```bash
pnpm add -g @pavstev/package-json-tools
```

### Local Installation

For project-specific use:

```bash
npm install --save-dev @pavstev/package-json-tools
```

Or with pnpm:

```bash
pnpm add -D @pavstev/package-json-tools
```

## Requirements

- **Node.js**: 18.0.0 or higher
- **Git**: 2.0+ (for repository operations)
- **Package Manager**: npm, pnpm, or yarn (detected automatically)

## Quick Start

1. Install globally: `npm install -g @pavstev/package-json-tools`
2. Navigate to your project: `cd my-project`
3. Clean your repository: `pjt`

That's it! Your repository is now clean and dependencies are fresh.

## Usage

### Basic Commands

#### Clean Git Repository

Clean the current git repository by removing untracked files and empty directories, then reinstall dependencies:

```bash
pjt
```

**Example Output:**

```
🔍 Scanning repository...
🗑️  Removed: node_modules/
🗑️  Removed: .cache/
🗑️  Removed: dist/
📦 Reinstalling dependencies...
✅ Repository cleaned successfully.
```

#### Show Help

Display available commands and options:

```bash
pjt --help
```

**Output:**

```
Usage: pjt [options] [command]

pjt CLI

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  git-clean       Clean and manage package.json related files (default)
  ai-commit       Generate AI-powered commit messages
  format          Format code using the project's formatter
  knip            Check for unused dependencies and files
  lint            Lint the codebase
  build           Build the project
  test            Run tests
  completions     Generate shell completions
  help [command]  display help for command
```

#### Show Version

```bash
pjt --version
```

### Advanced Usage

#### Dry Run Mode

Preview what would be cleaned without making changes:

```bash
pjt --dry-run
```

#### Force Mode

Skip confirmation prompts (use with caution):

```bash
pjt --force
```

#### Error Handling

If run outside a git repository:

```bash
$ pjt
❌ Error: Not a git repository
```

If no package.json found:

```bash
$ pjt
❌ Error: No package.json found in current directory
```

### Command Options

| Option      | Description                       | Default |
| ----------- | --------------------------------- | ------- |
| `--dry-run` | Preview changes without executing | `false` |
| `--force`   | Skip confirmation prompts         | `false` |
| `--verbose` | Show detailed output              | `false` |
| `--quiet`   | Suppress non-error output         | `false` |

## API

### Programmatic Usage

You can also use pjt programmatically in your Node.js applications:

```typescript
import { cleanRepository } from "@pavstev/package-json-tools";

async function cleanMyRepo() {
  try {
    await cleanRepository({
      dryRun: false,
      force: false,
      verbose: true,
    });
    console.log("Repository cleaned!");
  } catch (error) {
    console.error("Cleaning failed:", error);
  }
}
```

### TypeScript Types

```typescript
interface CleanOptions {
  dryRun?: boolean;
  force?: boolean;
  verbose?: boolean;
  quiet?: boolean;
}

interface CleanResult {
  removedFiles: string[];
  removedDirs: string[];
  reinstalled: boolean;
}
```

## Configuration

### Prettier Configuration

pjt includes a comprehensive Prettier configuration that can be used in your projects:

```javascript
// prettier.config.js
module.exports = require("@pavstev/package-json-tools/prettier-config");
```

Or for TypeScript projects:

```typescript
// prettier.config.ts
import config from "@pavstev/package-json-tools/prettier-config";
export default config;
```

### Environment Variables

| Variable      | Description                    | Default |
| ------------- | ------------------------------ | ------- |
| `PJT_DRY_RUN` | Enable dry-run mode globally   | `false` |
| `PJT_FORCE`   | Enable force mode globally     | `false` |
| `PJT_VERBOSE` | Enable verbose output globally | `false` |

## Contributing

We welcome contributions! Here's how to get started:

### Development Setup

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/your-username/package-json-tools.git
   cd package-json-tools
   ```
3. **Install dependencies**:
   ```bash
   pnpm install
   ```
4. **Build the project**:
   ```bash
   npm run build
   ```
5. **Run tests**:
   ```bash
   npm run test
   ```

### Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Add tests for new functionality
4. Ensure all tests pass: `npm run test`
5. Run linting: `npm run lint`
6. Format code: `npm run format`
7. Commit your changes using conventional commits
8. Submit a pull request

### Code Style

- **Language**: TypeScript with strict mode
- **Formatting**: Prettier (included configuration)
- **Linting**: ESLint
- **Testing**: Vitest with 100% coverage
- **Commits**: Conventional commits

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Author

**pavstev** - [GitHub](https://github.com/pavstev) | [npm](https://www.npmjs.com/~pavstev)
