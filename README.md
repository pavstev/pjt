# package-json-tools

[![npm version](https://badge.fury.io/js/%40pavstev%2Fpackage-json-tools.svg)](https://badge.fury.io/js/%40pavstev%2Fpackage-json-tools)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A cross-platform CLI tool for managing and cleaning git repositories, with a focus on package.json workflows.

## Features

- **Git Repository Cleaning**: Remove untracked files, empty directories, and reinstall dependencies
- **Cross-Platform**: Works on Linux, macOS, and Windows
- **TypeScript Built**: Strict mode, fully typed for reliability
- **CLI Subcommands**: Extensible command structure

## Installation

Install globally via npm:

```bash
npm install -g pjt
```

Or with pnpm:

```bash
pnpm add -g pjt
```

## Requirements

- Node.js 18+
- Git

## Usage

### Basic Commands

#### Clean Git Repository

Clean the current git repository by removing untracked files and empty directories, then reinstall dependencies:

```bash
pjt package-json-tools
```

**Example Output:**

```
Removed: node_modules/
Removed: .cache/
Removed: dist/
Reinstalled dependencies.
Repository cleaned successfully.
```

#### Show Help

Display available commands:

```bash
pjt --help
```

**Output:**

```
Usage: pjt [options] [command]

Package JSON Tools CLI

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  package-json-tools       Clean git repository by removing untracked files
  help [command]  display help for command
```

#### Show Version

```bash
pjt --version
```

### Advanced Usage

#### Error Handling

If run outside a git repository:

```bash
$ pjt package-json-tools
Error: Not a git repository
```

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Author

[pavstev](https://github.com/pavstev)
