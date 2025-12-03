# Agent Guidelines for pjt

## Commands

- **Build**: `pnpm build` (Unbuild to CommonJS)
- **Test all**: `pnpm test` (Vitest)
- **Test single**: `vitest run src/<file>.test.ts`
- **Type check**: `pnpm typecheck` (tsc --noEmit)
- **Lint**: `pnpm lint` (ESLint with --fix)
- **Format**: `pnpm format` (Prettier)
- **All checks**: `pnpm all` (format + lint + build + typecheck + test)

## Code Style

- **Language**: TypeScript 5.9+ with strict mode enabled
- **Target**: ES2022, CommonJS output
- **Imports**: Named imports preferred (`import { exec } from 'child_process'`)
- **Naming**: camelCase for variables/functions, PascalCase for types/interfaces
- **Async**: async/await with Promise-based APIs
- **Error handling**: Descriptive error messages, reject promises on errors
- **Testing**: Vitest with describe/it blocks, vi.mock for mocking
- **Formatting**: No semicolons, Prettier with custom config
- **Comments**: Avoid unless necessary for clarity

## Project Structure

- `src/main.ts`: CLI entry point
- `src/lib/`: Core utilities (git, fs, cli-utils, etc.)
- `src/eslint/`: ESLint configurations
- `src/prettier/`: Prettier configurations

## Dependencies

- Runtime: citty, consola, package-manager-detector, tinyexec, zod
- Dev: TypeScript, Unbuild, Vitest, ESLint, Prettier
