# OpenAgents Registry System Instructions

Welcome to the OpenAgents Registry System! This comprehensive guide will help
you understand, maintain, and extend the component registry that powers the
OpenAgents ecosystem.

## 📋 Table of Contents

- [System Overview](#system-overview)
- [Registry Structure](#registry-structure)
- [NX Workspace Management](#nx-workspace-management)
- [Adding New Components](#adding-new-components)
- [Profile Management](#profile-management)
- [Validation & Testing](#validation--testing)
- [Maintenance Tasks](#maintenance-tasks)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## 🎯 System Overview

The OpenAgents Registry System provides centralized management for all
components in the ecosystem:

- **57 total components** across 9 types
- **5 installation profiles** (essential → advanced)
- **Automated validation** and consistency checking
- **Comprehensive documentation** integration

### Key Benefits

- ✅ **Single Source of Truth** - All components cataloged in one place
- ✅ **Automated Validation** - Catch inconsistencies before they cause issues
- ✅ **Profile-Based Installation** - Flexible setup options for different use
  cases
- ✅ **Scalable Architecture** - Easy to add new components and features
- ✅ **Cross-Reference Safety** - Dependencies and references automatically
  validated

## 🏗️ Registry Structure

### Core Files

```
registry.json          # Main component registry
registry.schema.json   # JSON schema for validation
.opencode/instructions/ # This documentation
├── registry-system.md      # Main registry guide
└── nx-workspace-management.md # NX workspace & generators guide
```

### Component Types

| Type        | Count | Description           | Location                     |
| ----------- | ----- | --------------------- | ---------------------------- |
| `agents`    | 20    | Main OpenCode agents  | `.opencode/agent/`           |
| `subagents` | 8     | Specialized subagents | `.opencode/agent/subagents/` |
| `commands`  | 8     | OpenCode commands     | `.opencode/command/`         |
| `tools`     | 2     | Utility tools         | `.opencode/tool/`            |
| `plugins`   | 2     | OpenCode plugins      | `.opencode/plugin/`          |
| `contexts`  | 12    | Context files         | `.opencode/context/`         |
| `packages`  | 6     | Nx packages           | `packages/`                  |
| `skills`    | 5     | Claude skills         | `.claude/skills/`            |
| `configs`   | 1     | Configuration files   | `.opencode/`                 |

## 🏗️ NX Workspace Management

The pjt project uses NX for monorepo management and generator development. Key
learnings from migrating CLI commands to NX generators are documented in
[`nx-workspace-management.md`](./nx-workspace-management.md).

### Key NX Concepts

- **Generators**: Code that creates/modifies files and project structure
- **Executors**: Tasks that run on existing projects (build, test, lint)
- **Tree API**: NX's virtual filesystem for safe file operations
- **Schema Validation**: Zod-based option validation with JSON schema generation

### Generator Development Workflow

1. **Create Structure**: `packages/nx/src/generators/my-generator/`
2. **Implement Logic**: `main.ts` with Tree API
3. **Define Schema**: `schema.ts` with Zod validation
4. **Register Generator**: Update `generators.json`
5. **Add Dependencies**: Update `packages/nx/package.json`
6. **Test**: `nx g @pjt/nx:my-generator --help`

### Migration Patterns

**CLI Command → NX Generator:**

- Replace `citty.defineCommand()` with Tree API functions
- Convert `args` objects to Zod schemas
- Use `execSync()` for external commands
- Register in `generators.json` instead of auto-discovery

### Available Generators

```bash
# Git operations
nx g @pjt/nx:git-clean   # Clean and reinstall dependencies
nx g @pjt/nx:auto-commit # Auto-commit and push changes

# Code analysis
nx g @pjt/nx:loc # Count lines of code with cloc

# Content management
nx g @pjt/nx:download-readmes # Download READMEs from repos
nx g @pjt/nx:commit-diff      # Show commit differences
```

### Profile System

| Profile       | Components | Use Case                         |
| ------------- | ---------- | -------------------------------- |
| **Essential** | 10         | Basic development workflows      |
| **Developer** | 45         | Full development environment     |
| **Business**  | 20         | Documentation and business tools |
| **Full**      | 55         | Complete installation            |
| **Advanced**  | 55+        | Experimental features            |

## ➕ Adding New Components

### Step 1: Determine Component Type

Choose the appropriate type based on your component:

- **Agent**: Core AI agent with complex capabilities
- **Subagent**: Specialized agent for specific tasks
- **Command**: Executable command with instructions
- **Tool**: Utility tool or integration
- **Plugin**: OpenCode plugin functionality
- **Context**: Documentation or configuration context
- **Package**: Nx package with build system
- **Skill**: Claude.ai skill definition
- **Config**: Configuration file template

### Step 2: Create Component Files

Place your component in the appropriate directory:

```bash
# Example: New agent
mkdir -p .opencode/agent/
touch .opencode/agent/my-new-agent.md

# Example: New skill
mkdir -p .claude/skills/my-skill/
touch .claude/skills/my-skill/SKILL.md
```

### Step 3: Follow Component Template

**For OpenCode Agents:**

```yaml
---
description: "Brief description of what this agent does"
mode: primary
temperature: 0.2
tools:
  read: true
  write: true
  edit: true
---
# Agent instructions and capabilities
```

**For Claude Skills:**

```yaml
---
name: my-skill-name
description: Detailed description of the skill's capabilities
license: Complete terms in LICENSE.txt
---
# Skill implementation details
```

**For Commands:**

```yaml
---
description: "What this command accomplishes"
---
# Detailed execution instructions
```

### Step 4: Add to Registry

Update `registry.json` with your new component:

```json
{
  "category": "development",
  "dependencies": [],
  "description": "What this component does",
  "id": "my-component",
  "name": "My Component",
  "path": ".opencode/agent/my-component.md",
  "tags": ["tag1", "tag2"],
  "type": "agent"
}
```

### Step 5: Update Profiles (if needed)

Add your component to appropriate profiles in `registry.json`:

```json
"profiles": {
  "developer": {
    "components": [
      "my-component",
      // ... other components
    ]
  }
}
```

### Step 6: Validate

Run the validation command to ensure everything is correct:

```bash
# If using OpenCode command
/validate-repo

# Or run the validation script
node -e "
// Validation logic here
"
```

## 📊 Profile Management

### Understanding Profiles

Profiles determine which components are installed for different use cases:

- **Essential**: Minimal viable setup
- **Developer**: Full development environment
- **Business**: Business-focused tools
- **Full**: Everything available
- **Advanced**: Includes experimental features

### Modifying Profiles

1. **Edit registry.json** profiles section
2. **Add/remove component IDs** from profile arrays
3. **Update descriptions** if needed
4. **Validate changes** with `/validate-repo`

### Profile Guidelines

- **Essential**: Core functionality only (< 15 components)
- **Developer**: Most-used components (30-50 components)
- **Business**: Business + documentation tools (15-25 components)
- **Full**: Everything stable (50+ components)
- **Advanced**: Include experimental/unstable components

## ✅ Validation & Testing

### Automated Validation

Run comprehensive validation:

```bash
/validate-repo
```

This checks:

- ✅ Registry JSON syntax
- ✅ Component file existence
- ✅ Profile consistency
- ✅ Dependency resolution
- ✅ Documentation accuracy

### Manual Testing

Test your changes:

1. **File Existence**: Verify all paths in registry exist
2. **JSON Validity**: Ensure registry.json is valid JSON
3. **Schema Compliance**: Check against registry.schema.json
4. **Cross-References**: Verify all dependencies exist
5. **Documentation**: Confirm docs match registry claims

### Validation Output

The validation generates a detailed report:

```
🔍 OpenAgents Repository Validation Report
==================================================
Status: ✅ PASSED
Errors: 0 | Warnings: 2

✅ Validated Successfully
  • Registry JSON syntax
  • Component file existence
  • Profile integrity

⚠️ Warnings (2)
  • Orphaned context file: legacy/old-file.md
  • Missing description for component: new-agent

❌ Errors (0)
  • (none)

📊 Statistics
  • Total Components: 57
  • Files Found: 57
  • Valid Dependencies: 23
```

## 🔧 Maintenance Tasks

### Regular Maintenance

**Weekly Tasks:**

- Run `/validate-repo` to catch issues early
- Review validation warnings and address them
- Update component metadata if descriptions become outdated

**Monthly Tasks:**

- Review component usage and popularity
- Consider deprecating unused components
- Update profile compositions based on user feedback

### Component Lifecycle

1. **Proposal**: New component idea discussed
2. **Development**: Component created and tested
3. **Registration**: Added to registry.json
4. **Validation**: Passes all validation checks
5. **Documentation**: Added to appropriate docs
6. **Release**: Available in profiles
7. **Maintenance**: Regular updates and improvements
8. **Deprecation**: Marked as deprecated when needed
9. **Removal**: Removed from registry when obsolete

### Registry Updates

When updating the registry:

1. **Backup** current registry.json
2. **Make changes** following the schema
3. **Validate** changes with `/validate-repo`
4. **Test** affected components
5. **Update docs** if needed
6. **Commit** with clear message

## 🔍 Troubleshooting

### Common Issues

**❌ "Component file not found"**

```
Cause: Path in registry doesn't match actual file location
Solution: Update path in registry.json or move file to match registry
```

**❌ "Invalid dependency reference"**

```
Cause: Component depends on non-existent component
Solution: Add missing dependency or remove invalid reference
```

**⚠️ "Orphaned context file"**

```
Cause: File exists but not referenced in registry
Solution: Add to registry or delete if no longer needed
```

**❌ "Profile component not found"**

```
Cause: Profile references component that doesn't exist
Solution: Add missing component or remove from profile
```

### Debug Steps

1. **Check File Paths**: Ensure all paths in registry are correct
2. **Validate JSON**: Use a JSON validator on registry.json
3. **Run Validation**: Execute `/validate-repo` for detailed diagnostics
4. **Check Dependencies**: Manually verify dependency chains
5. **Review Profiles**: Ensure profile components exist

### Getting Help

- **Validation Errors**: Run `/validate-repo --verbose` for detailed output
- **Schema Issues**: Check registry.schema.json for field requirements
- **Documentation**: Refer to docs/agents/openagent.md for agent guidelines
- **Examples**: Look at existing components for reference patterns

## 🌟 Best Practices

### Component Design

- **Clear Purpose**: Each component should have a single, well-defined
  responsibility
- **Proper Metadata**: Include comprehensive descriptions and relevant tags
- **Dependency Management**: Keep dependencies minimal and well-documented
- **Category Assignment**: Choose appropriate categories for discoverability

### Registry Management

- **Consistent Naming**: Use kebab-case for IDs, descriptive names
- **Regular Validation**: Run validation after any registry changes
- **Documentation Sync**: Keep component docs in sync with registry descriptions
- **Version Control**: Commit registry changes with clear messages

### Profile Strategy

- **Progressive Enhancement**: Each profile should build on the previous
- **Use Case Focus**: Design profiles around specific user needs
- **Component Stability**: Only include stable components in lower profiles
- **Regular Review**: Reassess profile compositions based on usage data

### Quality Assurance

- **Automated Testing**: Use validation to catch issues early
- **Peer Review**: Have changes reviewed before merging
- **Documentation**: Maintain up-to-date component documentation
- **User Feedback**: Incorporate user experience improvements

## 🚀 Advanced Usage

### Custom Validation Scripts

Create custom validation for specific needs:

```bash
# Validate only agents
node -e "
// Custom agent validation logic
"

# Check specific profile
node -e "
// Profile-specific validation
"
```

### Bulk Operations

For managing multiple components:

```bash
# Add multiple components
# Edit registry.json directly with multiple additions

# Validate after bulk changes
/validate-repo

# Generate component list
node -e "
const registry = require('./registry.json');
console.log(Object.keys(registry.components).map(type =>
  \`\${type}: \${registry.components[type].length}\`
).join('\\n'));
"
```

### Integration Testing

Test component interactions:

```bash
# Test agent-subagent communication
# Validate cross-component dependencies
# Check profile installations
```

## 📞 Support & Resources

- **Registry Schema**: `registry.schema.json` - Complete field definitions
- **Validation Command**: `.opencode/command/validate-repo.md` - Detailed
  validation logic
- **NX Workspace Guide**: `.opencode/instructions/nx-workspace-management.md` -
  Generator development and workspace management
- **OpenAgent Docs**: `docs/agents/openagent.md` - Agent development guide
- **Installation Guide**: `docs/getting-started/installation.md` - Setup
  instructions

---

**Remember**: The registry system is the heart of OpenAgents. Keep it accurate,
validated, and well-maintained for the best user experience! 🎯
