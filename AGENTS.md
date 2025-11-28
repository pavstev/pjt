# Agent Guidelines for package-json-tools (pjt)

## Project Overview

package-json-tools (pjt) is a cross-platform CLI tool designed for managing and cleaning Git repositories, with a focus on package.json workflows. It provides utilities for repository maintenance, dependency management, and project hygiene.

## Architecture

### Project Structure

```
src/
├── bin/           # CLI entry points
│   ├── pjt.ts     # Main CLI binary
│   └── pjt.test.ts
├── fs.ts          # File system utilities
├── git.ts         # Git operations
├── index.ts       # Main library exports
├── package-manager.ts # Package manager interactions
├── prettier-config.ts # Prettier configuration
└── utils.ts       # General utilities
```

### Key Components

- **CLI Interface**: Command-line interface using Commander.js for parsing arguments
- **Git Integration**: Handles repository operations like cleaning untracked files
- **Package Management**: Supports npm, pnpm, and yarn for dependency operations
- **File System**: Cross-platform file operations with proper error handling

## Dependencies

### Runtime Dependencies

- `commander`: CLI framework
- `execa`: Process execution
- `fs-extra`: Enhanced file system operations
- `globby`: File globbing
- `semver`: Semantic versioning

### Development Dependencies

- `typescript`: TypeScript compiler
- `vitest`: Testing framework
- `@types/node`: Node.js type definitions
- `vite`: Build tool
- `prettier`: Code formatting
- `eslint`: Linting

## Development Workflow

### Setup

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Run setup: `npm run build`

### Commands

- **Build**: `npm run build` (TypeScript compilation to CommonJS)
- **Test all**: `npm run test` (Vitest test runner)
- **Test single file**: `vitest run src/<file>.test.ts`
- **Type check**: `npm run typecheck` (tsc --noEmit)
- **Clean**: `npm run clean` (remove dist/)
- **Lint**: `npm run lint` (ESLint)
- **Format**: `npm run format` (Prettier)

### Code Style

- **Language**: TypeScript with strict mode enabled
- **Modules**: ES2022 target, CommonJS output
- **Imports**: Named imports preferred (`import { exec } from 'child_process'`)
- **Naming**: camelCase for functions/variables, PascalCase for types/interfaces
- **Async**: Use async/await, Promise-based APIs
- **Error handling**: Reject promises on errors, descriptive error messages
- **Testing**: Vitest with describe/it blocks, vi.mock for mocking
- **Formatting**: No semicolons, consistent indentation, Prettier configuration

### Commit Guidelines

- Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, etc.
- Keep commits atomic and descriptive
- Run tests and linting before committing

## Testing

### Test Structure

- Unit tests in `*.test.ts` files alongside source files
- 100% code coverage required
- Mock external dependencies using `vi.mock`
- Test both success and error paths

### Running Tests

```bash
# Run all tests
npm run test

# Run specific test file
vitest run src/utils.test.ts

# Run with coverage
npm run test -- --coverage
```

## Deployment

### Build Process

1. TypeScript compilation to CommonJS
2. Generate type definitions (.d.ts files)
3. Bundle with Vite for optimal output
4. Include binary executables

### Publishing

- Publish to npm under `@pavstev/package-json-tools`
- Use semantic versioning
- Automated releases via CI/CD

## Active Technologies

- TypeScript 5.9+ with strict mode enabled + Vite 7.2+, ESLint 9.39+, Prettier 3.6+, Vitest 4.0+ (001-optimize-src-configs)
- File system (analysis of source files and configs) (001-optimize-src-configs)

- **TypeScript 5.9+**: Strict mode, advanced type features
- **Node.js 18+**: Modern JavaScript runtime
- **Vite**: Fast build tool for libraries
- **Vitest**: Modern testing framework
- **Prettier**: Code formatting with custom plugins

## Recent Changes

- **001-add-pjt-binary**: Initial implementation with TypeScript 5.9+, CLI structure, Git cleaning functionality
