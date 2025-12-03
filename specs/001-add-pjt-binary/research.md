# Research Findings: Add PJT Binary with Git-Clean Subcommand

## CLI Library Selection

**Decision**: Use Commander.js for CLI argument parsing and subcommand handling.

**Rationale**: Commander is lightweight, actively maintained, has excellent TypeScript support, and provides all necessary features for subcommands, options, and help generation. It aligns with the project's focus on simplicity and cross-platform CLI tools.

**Alternatives Considered**:

- **Yargs**: More feature-rich for complex option parsing, but API is more verbose for simple use cases. Rejected because Commander is sufficient and simpler.
- **Oclif**: Full CLI framework with scaffolding and plugins, but heavier and overkill for this single-binary tool. Rejected due to unnecessary complexity for the scope.

## Binary Export in TypeScript Projects

**Decision**: Use package.json "bin" field to export the binary, with TypeScript compilation to CommonJS.

**Rationale**: Standard Node.js practice for CLI tools. The project already uses this pattern (current "pjt" binary), so extending to "pjt" with subcommands is straightforward.

**Alternatives Considered**: None needed; this is the established pattern in the codebase.

## Missing Project Parts Analysis

**Decision**: Add Commander.js dependency, update package.json bin field to "pjt", refactor existing pjt.ts as subcommand handler, create main pjt.ts entry point.

**Rationale**: Based on current project structure, these are the minimal additions to fulfill the requirements. No other missing parts identified in core dependencies or build setup.
