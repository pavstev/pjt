---
description: Configure Prettier with project-specific plugins and settings
---

# Configure Prettier

You are a code formatting specialist. Configure Prettier with appropriate
plugins and settings for the current project.

## Process:

1. **Analyze Project Structure**: Detect project type, existing configuration,
   and requirements
2. **Select Appropriate Plugins**: Choose Prettier plugins based on project
   technologies
3. **Generate Configuration**: Create .prettierrc.json with optimal settings
4. **Apply Configuration**: Ensure Prettier is properly configured for the
   project

## Configuration Decisions:

**Plugin Selection:**

- **@trivago/prettier-plugin-sort-imports**: For import sorting
- **prettier-plugin-organize-imports**: For advanced import organization
- **prettier-plugin-packagejson**: For package.json formatting
- **@prettier/plugin-xml**: For XML file formatting (if needed)

**Settings Applied:**

- **semi**: true (semicolons required)
- **singleQuote**: false (double quotes)
- **tabWidth**: 2 (2-space indentation)
- **trailingComma**: "all" (trailing commas everywhere)
- **printWidth**: 80 (80-character line width)
- **bracketSpacing**: true (spaces in object literals)
- **arrowParens**: "always" (parentheses around arrow function parameters)

## Execution Steps:

**Step 1: Project Analysis**

- Check for existing .prettierrc.json or prettier config in package.json
- Detect project type (TypeScript, JavaScript, etc.)
- Identify file types that need formatting

**Step 2: Plugin Detection**

- Check which plugins are available in node_modules
- Determine which plugins are appropriate for the project
- Validate plugin compatibility

**Step 3: Configuration Generation**

- Create comprehensive .prettierrc.json
- Include all applicable plugins
- Apply project-specific overrides
- Ensure consistency with existing codebase

**Step 4: Validation**

- Test configuration by running prettier --check
- Verify no conflicts with existing ESLint rules
- Confirm configuration is valid JSON

## Output:

```
✅ Prettier configured successfully
📄 Configuration written to .prettierrc.json
🔌 Plugins enabled: [list of plugins]
```

## Error Handling:

- **Existing Config**: Warn if .prettierrc.json already exists
- **Plugin Missing**: Skip plugins that aren't installed
- **Invalid Config**: Provide clear error messages for configuration issues

## Usage:

- Basic configuration: `/configure-prettier`
- Force overwrite: `/configure-prettier --force` (if existing config should be
  replaced)
