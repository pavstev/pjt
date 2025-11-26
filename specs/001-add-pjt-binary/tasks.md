# Tasks: Add PJT Binary with Git-Clean Subcommand

**Input**: Design documents from `/specs/001-add-pjt-binary/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are included per TDD requirement in constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single project: `src/`, `tests/` at repository root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Add Commander.js dependency to package.json
- [x] T002 Update package.json bin field to export "pjt" binary
- [x] T003 Create src/bin/pjt.ts as main CLI entry point

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Refactor existing src/bin/package-json-tools.ts to export gitClean function
- [x] T005 Create src/lib/cli.ts for CLI utility functions
- [x] T006 Update src/index.ts to export CLI functionality

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Execute PJT Git-Clean Command (Priority: P1) 🎯 MVP

**Goal**: Enable users to run "pjt package-json-tools" to clean git repositories

**Independent Test**: Run `pjt package-json-tools` in a git repo and verify untracked files are removed

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T007 [P] [US1] Unit test for gitClean function in src/bin/package-json-tools.test.ts
- [x] T008 [P] [US1] Integration test for pjt package-json-tools command in tests/bin/pjt.test.ts

### Implementation for User Story 1

- [ ] T009 [US1] Implement package-json-tools subcommand in src/bin/pjt.ts
- [x] T010 [US1] Add error handling for non-git directories in src/bin/pjt.ts
- [x] T011 [US1] Add help and version options to src/bin/pjt.ts

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Analyze and Add Missing Project Parts (Priority: P2)

**Goal**: Ensure project has all necessary parts for the binary to function

**Independent Test**: Verify all dependencies are installed and binary builds successfully

### Tests for User Story 2 ⚠️

- [x] T012 [P] [US2] Test for project analysis in tests/integration/project-analysis.test.ts

### Implementation for User Story 2

- [x] T013 [US2] Add missing type definitions if needed
- [x] T014 [US2] Verify build process works with new binary

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Use Proper CLI Library (Priority: P3)

**Goal**: Integrate Commander.js for proper CLI argument parsing

**Independent Test**: Run `pjt --help` and verify proper help output

### Tests for User Story 3 ⚠️

- [x] T015 [P] [US3] Test CLI help output in tests/bin/pjt.test.ts

### Implementation for User Story 3

- [x] T016 [US3] Ensure Commander.js is properly configured in src/bin/pjt.ts

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T017 [P] Update documentation in README.md
- [x] T018 Code cleanup and refactoring
- [x] T019 Run quickstart.md validation
- [x] T020 [P] Additional integration tests in tests/integration/

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Unit test for gitClean function in src/bin/package-json-tools.test.ts"
Task: "Integration test for pjt package-json-tools command in tests/bin/pjt.test.ts"

# Launch implementation tasks sequentially:
Task: "Implement package-json-tools subcommand in src/bin/pjt.ts"
Task: "Add error handling for non-git directories in src/bin/pjt.ts"
Task: "Add help and version options to src/bin/pjt.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
