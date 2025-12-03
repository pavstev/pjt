# Agent Guidelines for pjt

## Commands

- **Build**: `pnpm build` (Vite build to CommonJS)
- **Test all**: `pnpm test` (Vitest)
- **Test single**: `vitest run src/<file>.test.ts`
- **Type check**: `pnpm typecheck` (tsc --noEmit)
- **Lint**: `pnpm lint` (ESLint with --fix)
- **Format**: `pnpm format` (Prettier)
- **All checks**: `pnpm all` (format + lint + build + typecheck + test + knip)

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

- `src/bin/`: CLI entry points
- `src/lib/`: Core utilities (git, fs, cli-utils, etc.)
- `src/eslint/`: ESLint configurations
- `src/prettier/`: Prettier configurations

## Dependencies

- Runtime: cac, consola, globify-gitignore, simple-git
- Dev: TypeScript, Vite, Vitest, ESLint, Prettier, knip
