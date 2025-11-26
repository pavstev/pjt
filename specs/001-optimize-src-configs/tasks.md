# Tasks: Optimize Source Code and Configuration Files

**Input**: Design documents from `/specs/001-optimize-src-configs/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are included as this project follows Test-First Development (TDD) per constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- New modules: `src/lib/`, `src/bin/commands/`, `tests/unit/`, `tests/integration/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for new optimization modules

- [ ] T001 Create analysis module structure in src/lib/analyzer.ts
- [ ] T002 Create optimizer module structure in src/lib/optimizer.ts
- [ ] T003 Create code metrics module structure in src/lib/code-metrics.ts
- [ ] T004 Create config optimizer module structure in src/lib/config-optimizer.ts
- [ ] T005 Create analyze command structure in src/bin/commands/analyze.ts
- [ ] T006 Create optimize command structure in src/bin/commands/optimize.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 [P] Implement CodeFile entity in src/lib/analyzer.ts
- [ ] T008 [P] Implement ConfigFile entity in src/lib/analyzer.ts
- [ ] T009 [P] Implement OptimizationReport entity in src/lib/analyzer.ts
- [ ] T010 Implement base analysis utilities in src/lib/analyzer.ts
- [ ] T011 Implement base optimization utilities in src/lib/optimizer.ts
- [ ] T012 Implement code metrics calculation in src/lib/code-metrics.ts
- [ ] T013 Implement config optimization logic in src/lib/config-optimizer.ts
- [ ] T014 Update main.ts to register new commands in src/bin/main.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Analyze Source Code Structure (Priority: P1) 🎯 MVP

**Goal**: Enable analysis of src/ directory to identify code optimization opportunities, duplicate code, and structural improvements

**Independent Test**: Can be fully tested by running analysis on src/ and verifying that optimization suggestions are generated without modifying any files

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T015 [P] [US1] Unit tests for analyzer utilities in tests/unit/analyzer.test.ts
- [ ] T016 [P] [US1] Unit tests for code metrics in tests/unit/code-metrics.test.ts
- [ ] T017 [US1] Integration test for analyze command in tests/integration/optimize-cli.test.ts

### Implementation for User Story 1

- [ ] T018 [US1] Implement duplicate code detection in src/lib/analyzer.ts
- [ ] T019 [US1] Implement structural analysis in src/lib/analyzer.ts
- [ ] T020 [US1] Implement analysis report generation in src/lib/analyzer.ts
- [ ] T021 [US1] Implement analyze command CLI interface in src/bin/commands/analyze.ts
- [ ] T022 [US1] Add progress reporting and timeout handling in src/bin/commands/analyze.ts
- [ ] T023 [US1] Add file filtering and pattern matching in src/bin/commands/analyze.ts

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Optimize Package.json Configuration (Priority: P2)

**Goal**: Enable optimization of package.json file for script efficiency, dependency management, and configuration improvements

**Independent Test**: Can be fully tested by analyzing package.json and generating optimization suggestions without applying changes

### Tests for User Story 2 ⚠️

- [ ] T024 [P] [US2] Unit tests for config optimizer in tests/unit/config-optimizer.test.ts
- [ ] T025 [US2] Integration test for package.json optimization in tests/integration/optimize-cli.test.ts

### Implementation for User Story 2

- [ ] T026 [US2] Implement package.json parsing and analysis in src/lib/config-optimizer.ts
- [ ] T027 [US2] Implement script efficiency analysis in src/lib/config-optimizer.ts
- [ ] T028 [US2] Implement dependency optimization logic in src/lib/config-optimizer.ts
- [ ] T029 [US2] Implement package.json optimization suggestions in src/lib/optimizer.ts
- [ ] T030 [US2] Add package.json optimization to optimize command in src/bin/commands/optimize.ts
- [ ] T031 [US2] Add backup and rollback for package.json changes in src/bin/commands/optimize.ts

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Optimize Vite Configuration (Priority: P3)

**Goal**: Enable optimization of vite.config.ts file for build performance and configuration efficiency

**Independent Test**: Can be fully tested by analyzing vite.config.ts and generating optimization suggestions without modifying the build process

### Tests for User Story 3 ⚠️

- [ ] T032 [US3] Integration test for vite.config.ts optimization in tests/integration/optimize-cli.test.ts

### Implementation for User Story 3

- [ ] T033 [US3] Implement vite.config.ts parsing and analysis in src/lib/config-optimizer.ts
- [ ] T034 [US3] Implement build performance optimization logic in src/lib/config-optimizer.ts
- [ ] T035 [US3] Implement plugin configuration optimization in src/lib/config-optimizer.ts
- [ ] T036 [US3] Implement vite.config.ts optimization suggestions in src/lib/optimizer.ts
- [ ] T037 [US3] Add vite.config.ts optimization to optimize command in src/bin/commands/optimize.ts
- [ ] T038 [US3] Add validation for vite config changes in src/bin/commands/optimize.ts

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T039 [P] Add comprehensive error handling across all modules
- [ ] T040 [P] Add logging and progress reporting improvements
- [ ] T041 Performance optimization for large codebases
- [ ] T042 [P] Additional unit tests for edge cases in tests/unit/
- [ ] T043 Documentation updates in README.md
- [ ] T044 Run quickstart.md validation and update examples
- [ ] T045 Final integration testing across all commands

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
- Core utilities before command interfaces
- Analysis before optimization
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
Task: "Unit tests for analyzer utilities in tests/unit/analyzer.test.ts"
Task: "Unit tests for code metrics in tests/unit/code-metrics.test.ts"
Task: "Integration test for analyze command in tests/integration/optimize-cli.test.ts"

# Launch implementation tasks sequentially within story:
Task: "Implement duplicate code detection in src/lib/analyzer.ts"
Task: "Implement structural analysis in src/lib/analyzer.ts"
Task: "Implement analysis report generation in src/lib/analyzer.ts"
Task: "Implement analyze command CLI interface in src/bin/commands/analyze.ts"
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
