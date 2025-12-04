import fs from "node:fs";
import path from "node:path";

type PackageConfig = {
  additionalSections?: string[];
  customContent?: (pkgJson: Record<string, unknown>, pkgPath: string) => string;
};

export const packageConfigs: Record<string, PackageConfig> = {
  cli: {
    customContent: () => `
The CLI tool provides a simple command-line interface for cleaning and maintaining Git repositories.

### Basic Command

\`\`\`bash
pjt [options]
\`\`\`

### Options

- \`--dry-run, -d\`: Skip execution, just log what would be done
- \`--hard, -f\`: Force clean (removes more files)
- \`--dir\`: Target directory (default: current directory)
- \`--help, -h\`: Show help
- \`--version, -v\`: Show version

### Examples

\`\`\`bash
# Clean current directory
pjt

# Preview changes
pjt --dry-run

# Clean specific directory
pjt --dir /path/to/project
\`\`\`
`,
  },
  core: {
    customContent: (pkgJson: Record<string, unknown>, pkgPath: string) => {
      const indexPath = path.join(pkgPath, "src/index.ts");
      let exportsSection = "";

      if (fs.existsSync(indexPath)) {
        const indexContent = fs.readFileSync(indexPath, "utf-8");
        const exports = indexContent
          .split("\n")
          .filter(line => line.startsWith("export"))
          .map(line => line.trim());
        exportsSection = `
## Exported Modules

${exports.map(exp => `- \`${exp}\``).join("\n")}
`;
      }

      return `
Core utilities provide the foundation for PJT functionality.
${exportsSection}
## Available Utilities

- **File System Operations**: Reading, writing, and managing files and directories
- **Git Integration**: Repository status, cleaning ignored files
- **Command Execution**: Running shell commands synchronously and asynchronously
- **Logging**: Structured logging with different levels
- **Error Handling**: Custom error types and handling utilities
- **CLI Utilities**: Argument parsing and help generation
- **Build Utilities**: Build process helpers
- **Type Definitions**: TypeScript types for all utilities
`;
    },
  },
  eslint: {
    customContent: (pkgJson: Record<string, unknown>, pkgPath: string) => {
      const indexPath = path.join(pkgPath, "src/index.ts");
      let exportsSection = "";

      if (fs.existsSync(indexPath)) {
        const indexContent = fs.readFileSync(indexPath, "utf-8");
        const exports = indexContent
          .split("\n")
          .filter(line => line.includes("export"))
          .map(line => line.trim());
        exportsSection = `
## Exported Configurations

${exports.map(exp => `- \`${exp}\``).join("\n")}
`;
      }

      return `
ESLint configurations for maintaining code quality.
${exportsSection}
## Available Configs

- **recommended**: Basic recommended rules
- **strict**: Stricter rules for maximum quality
- **minimal**: Minimal rules for basic linting
- **tsRecommended**: TypeScript specific rules
- **jsonc**: JSON with comments rules
- **jsonSchema**: JSON Schema validation
- **markdownConf**: Markdown linting
- **mdxConf**: MDX linting
`;
    },
  },
  nx: {
    customContent: () => `
Nx generators for configuring PJT tools in your workspace.

## Generators

- **configure-prettier**: Configure Prettier in your Nx workspace

## Usage

\`\`\`bash
nx generate @pjt/nx:configure-prettier
\`\`\`
`,
  },
  prettier: {
    customContent: () => `
Prettier configuration for consistent code formatting.

## Usage

Import the config in your Prettier configuration:

\`\`\`javascript
// .prettierrc.js
module.exports = require('@pjt/prettier');
\`\`\`

Or in package.json:

\`\`\`json
{
  "prettier": "@pjt/prettier"
}
\`\`\`
`,
  },
  schemas: {
    customContent: () => `
Zod schemas for validating prettier configurations and plugin definitions.

## Usage

Import the schemas to validate your prettier configurations:

\`\`\`typescript
import { PluginDefinitionsSchema } from '@pjt/schemas';

const config = PluginDefinitionsSchema.parse(yourConfig);
\`\`\`
`,
  },
};
