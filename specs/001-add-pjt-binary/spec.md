# Feature Specification: Add PJT Binary with Git-Clean Subcommand

**Feature Branch**: `001-add-pjt-binary`  
**Created**: Wed Nov 26 2025  
**Status**: Draft  
**Input**: User description: "analyze the whole project and add missing parts. this should actually export a single binary "pjt" with subcommand "package-json-tools" and proper cli lib usage. find online"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Execute PJT Git-Clean Command (Priority: P1)

As a developer, I want to run the "pjt package-json-tools" command to clean my git repository, so that I can remove untracked files and reset to a clean state.

**Why this priority**: This is the core functionality requested, enabling the primary use case of the binary.

**Independent Test**: Can be fully tested by running the command in a git repository and verifying that untracked files are removed and the repository is clean.

**Acceptance Scenarios**:

1. **Given** a git repository with untracked files, **When** I run `pjt package-json-tools`, **Then** all untracked files are removed and the repository is clean.
2. **Given** a git repository that is already clean, **When** I run `pjt package-json-tools`, **Then** no changes occur and the command completes successfully.
3. **Given** a directory that is not a git repository, **When** I run `pjt package-json-tools`, **Then** an appropriate error message is displayed.

---

### User Story 2 - Analyze and Add Missing Project Parts (Priority: P2)

As a developer, I want the project to be analyzed and missing parts added, so that the binary is complete and functional.

**Why this priority**: Ensures the project is fully implemented before use.

**Independent Test**: Can be tested by checking that all necessary files and configurations are present for the binary to build and run.

**Acceptance Scenarios**:

1. **Given** the project source, **When** analyzed, **Then** all missing dependencies, configurations, and code are identified and added.
2. **Given** incomplete project setup, **When** missing parts are added, **Then** the project builds successfully.

---

### User Story 3 - Use Proper CLI Library (Priority: P3)

As a developer, I want the binary to use a proper CLI library for command parsing, so that it handles arguments and subcommands correctly.

**Why this priority**: Improves usability and maintainability of the CLI interface.

**Independent Test**: Can be tested by verifying that the CLI accepts subcommands and options as expected.

**Acceptance Scenarios**:

1. **Given** the binary is built, **When** I run `pjt --help`, **Then** help information is displayed.
2. **Given** invalid arguments, **When** I run the command, **Then** appropriate error messages are shown.

---

### Edge Cases

- What happens when the command is run without proper permissions?
- How does the system handle large repositories with many untracked files?
- What if the package-json-tools subcommand conflicts with existing git commands?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST export a single binary named "pjt".
- **FR-002**: System MUST support a "package-json-tools" subcommand that cleans the git repository.
- **FR-003**: System MUST use a proper CLI library for argument parsing and subcommand handling.
- **FR-004**: System MUST analyze the project and add any missing parts for functionality.
- **FR-005**: System MUST find and integrate an appropriate CLI library from online sources.

### Key Entities _(include if feature involves data)_

- **Binary**: The executable "pjt" that provides CLI functionality.
- **Subcommand**: The "package-json-tools" command within the binary.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can successfully run `pjt package-json-tools` in a git repository and see untracked files removed.
- **SC-002**: The binary builds and executes without errors.
- **SC-003**: CLI library is properly integrated and handles commands as expected.
- **SC-004**: Project analysis identifies and adds all missing components.
