<!--
Sync Impact Report:
- Version change: 0.0.0 → 1.0.0
- Added sections: Core Principles (5 principles), Technology Constraints, Development Workflow
- Templates requiring updates: plan-template.md (Constitution Check section)
- Follow-up TODOs: None
-->

# package-json-tools CLI Tool Constitution

## Core Principles

### I. TypeScript Strict Mode

All code must use TypeScript with strict mode enabled. ES2022 target with CommonJS modules.
Type safety is non-negotiable - prevents runtime errors and improves maintainability.

### II. CLI Interface

All functionality exposed via CLI with proper error handling. Text in/out protocol: stdin/args → stdout, errors → stderr.
Cross-platform compatibility required - works on Linux, macOS, and Windows.

### III. Test-First Development (NON-NEGOTIABLE)

TDD mandatory: Tests written with Vitest → User approved → Tests fail → Then implement.
Red-Green-Refactor cycle strictly enforced. All functionality must be tested.

### IV. Code Consistency

Follow established conventions: camelCase for functions/variables, PascalCase for types.
Named imports preferred. No semicolons, consistent indentation. Async/await throughout.

### V. Build Verification

All changes must pass: npm run build, npm run typecheck, npm run test.
Single test execution supported: vitest run src/<file>.test.ts.
No commits without passing all verification steps.

## Technology Constraints

Technology stack requirements: TypeScript 5.9+, Node.js 18+, Vitest 4.0+, pnpm package manager.
Cross-platform file system operations using Node.js fs/promises API.
Error handling via Promise rejection with descriptive messages.

## Development Workflow

Code review requirements: All PRs must verify constitution compliance.
Testing gates: Unit tests required for all functions, integration tests for CLI commands.
Quality gates: TypeScript strict mode violations block merge, test coverage maintained.

## Governance

Constitution supersedes all other practices. Amendments require documentation, approval, and migration plan.
All PRs/reviews must verify compliance. Complexity must be justified.
Use AGENTS.md for runtime development guidance.

**Version**: 1.0.0 | **Ratified**: 2025-11-26 | **Last Amended**: 2025-11-26
