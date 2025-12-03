import { markdownToHtml } from '../utils/markdown.js';

export const generateGettingStartedPage = async (): Promise<{ html: string; data: Record<string, unknown> }> => {
  const markdown = `---
title: Getting Started
description: Learn how to install and use PJT
---

# Getting Started

## Installation

Install PJT globally using npm:

\`\`\`bash
npm install -g @pjt/cli
\`\`\`

Or using pnpm:

\`\`\`bash
pnpm add -g @pjt/cli
\`\`\`

## Basic Usage

Navigate to your project directory and run PJT:

\`\`\`bash
cd /path/to/your/project
pjt
\`\`\`

This will:
1. Clean empty directories
2. Remove ignored files
3. Reinstall dependencies

## Options

- \`--dry-run, -d\`: Preview changes without executing
- \`--help, -h\`: Show help information
- \`--version, -v\`: Show version

## Next Steps

Explore the [CLI guide](./guides/cli) for detailed usage instructions.
`;

  const html = await markdownToHtml(markdown);

  return {
    html,
    data: {
      title: 'Getting Started',
      description: 'Learn how to install and use PJT',
    },
  };
}