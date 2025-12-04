# Agent Guidelines for pjt

## Commands

- **Build**: `pnpm build` (Nx run-many -t build)
- **Test all**: `pnpm all` (includes build, lint, typecheck)
- **Test single**: `nx test <project-name>` (Nx test runner)
- **Type check**: `pnpm typecheck` (Nx run-many -t typecheck)
- **Lint**: `pnpm lint` (Nx run-many -t lint with --fix)
- **Format**: `pnpm format` (Prettier with custom config)
- **All checks**: `pnpm all` (build + lint + typecheck, sequential)

## Code Style

- **Language**: TypeScript 5.9+ with strict mode enabled
- **Target**: ES2022, module output (ESM)
- **Imports**: Named imports preferred (`import { exec } from 'child_process'`)
- **Naming**: camelCase for variables/functions, PascalCase for types/interfaces
- **Async**: async/await with Promise-based APIs
- **Error handling**: Descriptive error messages, proper error propagation
- **Testing**: Vitest with describe/it blocks, vi.mock for mocking
- **Formatting**: Semicolons required, Prettier with custom config
- **Comments**: JSDoc for public APIs, avoid unnecessary comments

## Project Structure

- `packages/cli/`: Main CLI tool
- `packages/core/`: Shared utilities and core functionality
- `packages/eslint/`: ESLint configurations and rules
- `packages/prettier/`: Prettier configurations
- `packages/nx/`: Nx generators and executors
- `packages/schemas/`: JSON schemas for validation
- `packages/docs/`: Documentation site (Astro)

## Dependencies

- Runtime: citty, consola, package-manager-detector, tinyexec, zod
- Dev: TypeScript, Nx, Vitest, ESLint, Prettier
