# Agent Guidelines for @pavstev/package-json-tools

## Commands

- **Build**: `npm run build` (TypeScript compilation)
- **Test all**: `npm run test` (Vitest)
- **Test single file**: `vitest run src/<file>.test.ts`
- **Type check**: `npm run typecheck` (tsc --noEmit)
- **Clean**: `npm run clean` (remove dist/)

## Code Style

- **Language**: TypeScript with strict mode enabled
- **Modules**: ES2022 target, CommonJS output
- **Imports**: Named imports preferred (`import { exec } from 'child_process'`)
- **Naming**: camelCase for functions/variables, PascalCase for types
- **Async**: Use async/await, Promise-based APIs
- **Error handling**: Reject promises on errors, descriptive error messages
- **Testing**: Vitest with describe/it blocks, vi.mock for mocking
- **Formatting**: No semicolons, consistent indentation

## Active Technologies

- TypeScript 5.9+ (001-add-pjt-binary)

## Recent Changes

- 001-add-pjt-binary: Added TypeScript 5.9+
