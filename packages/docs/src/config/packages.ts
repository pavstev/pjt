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
Prettier configuration utilities for consistent code formatting.

## Usage

Use the configure function to generate .prettierrc.json:

\`\`\`javascript
import { configure } from '@pjt/core';

await configure({
  cwd: process.cwd(),
  logger: console,
  writeFile: require('fs/promises').writeFile,
});
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
