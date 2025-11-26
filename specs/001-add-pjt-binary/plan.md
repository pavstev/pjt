# Implementation Plan: Add PJT Binary with Git-Clean Subcommand

**Branch**: `001-add-pjt-binary` | **Date**: Wed Nov 26 2025 | **Spec**: spec.md
**Input**: Feature specification from `/specs/001-add-pjt-binary/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Primary requirement: Export a single binary "pjt" with subcommand "pjt" for cleaning git repositories, using a proper CLI library found online. Analyze the project and add any missing parts for functionality.

## Technical Context

**Language/Version**: TypeScript 5.9+
**Primary Dependencies**: CLI library [NEEDS CLARIFICATION: commander, yargs, or similar for Node.js CLI]
**Storage**: N/A
**Testing**: Vitest
**Target Platform**: Cross-platform (Linux, macOS, Windows)
**Project Type**: CLI tool
**Performance Goals**: Fast execution for git repository cleaning operations
**Constraints**: Cross-platform file system operations, proper error handling via stderr
**Scale/Scope**: Single binary with extensible subcommand architecture

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- [x] **TypeScript Strict Mode**: Project uses TypeScript with strict mode enabled
- [x] **CLI Interface**: Feature exposes functionality via CLI with proper error handling
- [x] **Test-First Development**: Testing strategy aligns with Vitest requirements
- [x] **Code Consistency**: Follows established naming, formatting, and import conventions
- [x] **Build Verification**: Project structure supports required build/test commands

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── bin/
│   ├── pjt.ts          # Main CLI entry point with subcommands
│   └── pjt.ts    # Git-clean subcommand implementation
├── index.ts            # Library entry point
└── lib/
    └── cli.ts          # CLI utility functions

tests/
├── bin/
│   ├── pjt.test.ts     # CLI integration tests
│   └── pjt.test.ts # Existing pjt tests
├── integration/
└── unit/
```

**Structure Decision**: Single project structure selected as this is a CLI tool. Main binary moved from "pjt" to "pjt" with subcommands. Existing pjt.ts refactored as subcommand handler.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
