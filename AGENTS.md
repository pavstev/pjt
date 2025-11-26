# Agent Guidelines for pjt

## Commands

- **Build**: `pnpm build` (Nx run-many -t build)
- **Test all**: `nx run-many -t test` (Jest/Vitest across all projects)
- **Test single**: `nx test <project-name>` (e.g., `nx test cli`)
- **Type check**: `pnpm typecheck` (Nx run-many -t typecheck)
- **Lint**: `pnpm lint` (Nx run-many -t lint --fix)
- **Format**: `pnpm format` (Prettier with custom config)
- **All checks**: `pnpm all` (build + lint + typecheck)

## Code Style

- **Language**: TypeScript 5.9+ with strict mode, noUnusedLocals/Parameters
- **Target**: ES2022, module output (ESM), moduleResolution: "bundler"
- **Imports**: Named imports preferred, auto-organized by
  prettier-plugin-organize-imports
- **Naming**: camelCase vars/functions, PascalCase types/interfaces, kebab-case
  commands
- **Async**: async/await with Promise-based APIs, proper error propagation
- **Error handling**: Descriptive messages, zod schemas for validation
- **Testing**: Jest with Nx preset, vi.mock for mocking (when tests exist)
- **Formatting**: Semicolons required, 2-space tabs, 80-char width, trailing
  commas
- **Comments**: JSDoc for public APIs only, avoid unnecessary comments
