# NX Workspace Management & Generator Development

## Overview

This document captures key learnings from migrating CLI commands to NX
generators, providing comprehensive guidance for NX workspace management and
generator development in the pjt monorepo.

## NX Workspace Architecture

### Project Structure

```
packages/
├── cli/           # ❌ REMOVED - Migrated to NX generators
├── core/          # Shared utilities and core functionality
├── nx/            # ✅ NX generators and executors
├── eslint/        # ESLint configurations
├── schemas/       # JSON schemas for validation
├── docs/          # Documentation site (Astro)
└── ...
```

### Key NX Concepts Learned

#### 1. Generators vs Executors

- **Generators**: Create/modify files and project structure
- **Executors**: Run tasks (build, test, lint) on existing projects

#### 2. Tree API vs Direct File Operations

```typescript
// ❌ CLI approach (direct file system)
import { execSync } from "node:child_process";
execSync("git clean -fd", { cwd: dir });

// ✅ NX Generator approach (Tree API)
import type { Tree } from "@nx/devkit";
export const generator = async (tree: Tree, options: Options) => {
  // Tree API operations
  // No direct file system access
};
```

#### 3. Schema-Driven Development

```typescript
// Schema definition with Zod
export const GitCleanGeneratorSchema = z.object({
  dir: z.string().default(process.cwd()),
  hard: z.boolean().default(false),
});

// JSON Schema generation for validation
// Automatic CLI option generation
```

## Generator Development Workflow

### 1. Create Generator Structure

```bash
# Create generator directory
mkdir -p packages/nx/src/generators/my-generator

# Required files
touch packages/nx/src/generators/my-generator/main.ts
touch packages/nx/src/generators/my-generator/schema.ts
touch packages/nx/src/generators/my-generator/schema.json
```

### 2. Implement Generator Logic

#### Main Generator File (`main.ts`)

```typescript
import type { Tree } from "@nx/devkit";
import { execSync } from "node:child_process";
import { logger } from "@nx/devkit";

import type { MyGeneratorSchemaType } from "./schema";

export const generator = async (
  _tree: Tree, // Prefix with _ if not using Tree API
  options: MyGeneratorSchemaType,
): Promise<void> => {
  try {
    // Generator logic here
    logger.info("Starting operation...");

    // Use execSync for external commands
    execSync("some-command", { stdio: "inherit" });

    logger.info("Operation completed");
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};
```

#### Schema Definition (`schema.ts`)

```typescript
import { z } from "zod";

export const MyGeneratorSchema = z
  .object({
    // Define options with defaults
    option1: z.string().default("default-value"),
    option2: z.boolean().default(false),
  })
  .strict();

export type MyGeneratorSchemaType = z.infer<typeof MyGeneratorSchema>;
```

#### JSON Schema (`schema.json`)

```json
{
  "$schema": "https://json-schema.org/schema",
  "properties": {
    "option1": {
      "type": "string",
      "description": "Description of option1",
      "default": "default-value"
    },
    "option2": {
      "type": "boolean",
      "description": "Description of option2",
      "default": false
    }
  },
  "title": "My Generator",
  "type": "object"
}
```

### 3. Register Generator

#### Update `generators.json`

```json
{
  "generators": {
    "my-generator": {
      "description": "What this generator does",
      "factory": "./src/generators/my-generator/main",
      "schema": "./src/generators/my-generator/schema.json"
    }
  }
}
```

### 4. Add Dependencies

#### Update `packages/nx/package.json`

```json
{
  "dependencies": {
    "@nx/devkit": "22.1.3",
    "@pjt/core": "workspace:*",
    // Add any required dependencies
    "execa": "9.6.1",
    "chalk": "5.6.2"
  }
}
```

## Migration Patterns: CLI → NX Generator

### Command Structure Conversion

#### Original CLI Command

```typescript
import { defineCommand } from "citty";
import { z } from "zod";

const schema = z.object({
  dir: z.string().default(process.cwd()),
  hard: z.boolean().default(false),
});

const gitClean = defineCommand({
  args: {
    dir: { type: "string", default: process.cwd() },
    hard: { type: "boolean" },
  },
  run: async ({ args }) => {
    const { dir, hard } = schema.parse(args);
    // Command logic
  },
});
```

#### Converted NX Generator

```typescript
import type { Tree } from "@nx/devkit";
import { z } from "zod";

export const GitCleanGeneratorSchema = z.object({
  dir: z.string().default(process.cwd()),
  hard: z.boolean().default(false),
});

export const generator = async (
  _tree: Tree,
  options: z.infer<typeof GitCleanGeneratorSchema>,
): Promise<void> => {
  const { dir, hard } = options;
  // Generator logic
};
```

### Key Differences

| Aspect           | CLI Command           | NX Generator             |
| ---------------- | --------------------- | ------------------------ |
| **API**          | citty `defineCommand` | Tree API                 |
| **Arguments**    | `args` object         | Schema-validated options |
| **File Ops**     | Direct filesystem     | Tree API (when needed)   |
| **Execution**    | `citty.run()`         | `nx g @scope:generator`  |
| **Dependencies** | Runtime deps          | Build-time deps          |
| **Registration** | Auto-discovery        | `generators.json`        |

## Common Migration Challenges

### 1. Tree API vs Direct File Operations

```typescript
// ❌ Direct filesystem (CLI)
import { writeFile } from "node:fs/promises";
await writeFile("file.txt", "content");

// ✅ Tree API (Generator)
export const generator = async (tree: Tree) => {
  tree.write("file.txt", "content");
};
```

### 2. External Command Execution

```typescript
// Both approaches work, but prefer execSync in generators
import { execSync } from "node:child_process";
execSync("git status", { stdio: "inherit" });
```

### 3. Logger Usage

```typescript
// CLI: Custom logger
import { createLogger } from "../lib/logger";
const logger = createLogger();

// Generator: NX devkit logger
import { logger } from "@nx/devkit";
```

### 4. Error Handling

```typescript
// Consistent error handling pattern
try {
  // Operation
} catch (error) {
  throw new Error(error instanceof Error ? error.message : String(error));
}
```

## Build System Integration

### Dependencies Management

- Use `workspace:*` for internal packages
- Add external dependencies to `packages/nx/package.json`
- Run `pnpm install` after dependency changes

### TypeScript Configuration

- Generators use base `tsconfig.base.json`
- Path mappings for internal packages
- Strict mode enabled for type safety

### Build Process

```bash
# Build all packages
pnpm build

# Build specific package
nx build nx

# Reset NX cache (after structural changes)
nx reset
```

## Testing Generators

### Manual Testing

```bash
# Test generator help
nx g @pjt/nx:my-generator --help

# Run generator with options
nx g @pjt/nx:my-generator --option1 value

# Dry run (if implemented)
nx g @pjt/nx:my-generator --dry-run
```

### Validation

- Schema validation via Zod
- JSON schema compliance
- Runtime error handling
- Build success confirmation

## Best Practices

### 1. Schema Design

- Use Zod for runtime validation
- Provide sensible defaults
- Include descriptive field documentation
- Keep schemas focused and minimal

### 2. Error Handling

- Wrap operations in try-catch
- Provide meaningful error messages
- Use NX logger for consistent output
- Fail fast on validation errors

### 3. Tree API Usage

- Use Tree API for file operations when possible
- Fall back to execSync for external commands
- Avoid direct filesystem access in generators

### 4. Dependency Management

- Minimize external dependencies
- Use workspace packages for internal functionality
- Keep package.json up to date

### 5. Documentation

- Include comprehensive descriptions
- Document all options and their effects
- Provide usage examples
- Update README and guides

## Migration Checklist

### Pre-Migration

- [ ] Analyze CLI command functionality
- [ ] Identify dependencies and utilities
- [ ] Plan Tree API vs execSync usage
- [ ] Design generator schema

### Migration Steps

- [ ] Create generator directory structure
- [ ] Implement main.ts with Tree API
- [ ] Create schema.ts with Zod validation
- [ ] Generate schema.json
- [ ] Update generators.json
- [ ] Add required dependencies
- [ ] Test generator functionality
- [ ] Update documentation

### Post-Migration

- [ ] Remove original CLI command
- [ ] Update workspace configuration
- [ ] Clean up unused dependencies
- [ ] Validate build system
- [ ] Update user documentation

## Advanced Patterns

### File Templating

```typescript
export const generator = async (tree: Tree) => {
  // Generate files from templates
  generateFiles(tree, path.join(__dirname, "files"), ".", {
    // Template variables
    name: options.name,
    version: "1.0.0",
  });
};
```

### Dynamic Options

```typescript
export const generator = async (tree: Tree, options: Options) => {
  // Read workspace configuration
  const nxJson = readNxJson(tree);

  // Access project graph
  const projectGraph = createProjectGraphAsync();

  // Conditional logic based on workspace state
};
```

### Multi-Step Operations

```typescript
export const generator = async (tree: Tree, options: Options) => {
  // Step 1: Validation
  validateOptions(options);

  // Step 2: File generation
  generateFiles(tree, templates, destination, options);

  // Step 3: Configuration updates
  updateNxJson(tree, options);

  // Step 4: Formatting
  await formatFiles(tree);
};
```

## Troubleshooting

### Common Issues

**"Cannot find module '@pjt/core'"**

- Ensure `@pjt/core` is in dependencies
- Run `pnpm install` after adding dependencies
- Check workspace path mappings

**"Generator not found"**

- Verify `generators.json` registration
- Check factory path is correct
- Ensure schema.json exists

**"Schema validation failed"**

- Validate JSON schema syntax
- Check Zod schema matches JSON schema
- Test with `nx g generator --help`

**Build failures**

- Run `nx reset` after structural changes
- Check TypeScript compilation errors
- Verify all dependencies are installed

### Debug Commands

```bash
# List available generators
nx list @pjt/nx

# Show generator details
nx show generator @pjt/nx:my-generator

# Verbose build output
nx build nx --verbose

# Clean rebuild
nx reset && nx build nx
```

## Resources

- [NX Generator Documentation](https://nx.dev/extending-nx/generators)
- [Tree API Reference](https://nx.dev/recipes/generators/tree-api)
- [Schema Validation](https://nx.dev/recipes/generators/creating-generator-options)
- [Workspace Management](https://nx.dev/concepts/workspace-structure)</content>
  <parameter name="filePath">.opencode/instructions/nx-workspace-management.md
