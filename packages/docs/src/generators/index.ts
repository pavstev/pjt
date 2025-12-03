import { markdownToHtml } from '../utils/markdown.js';

export const generateIndexPage = async (packages: string[]): Promise<{ html: string; data: Record<string, unknown> }> => {
  const markdown = `---
title: Welcome to PJT
description: A powerful cross-platform CLI tool for maintaining clean Git repositories
---

# Welcome to PJT

PJT is a powerful cross-platform CLI tool designed to help you maintain clean Git repositories by removing empty directories, ignored files, and reinstalling dependencies with support for npm, pnpm, and yarn.

## Features

- **Cross-platform**: Works on Windows, macOS, and Linux
- **Multiple package managers**: Supports npm, pnpm, and yarn
- **Smart cleaning**: Removes empty directories and ignored files
- **Dependency management**: Automatically reinstalls dependencies after cleaning

## Packages

${packages.map(pkg => `- [${pkg}](./guides/${pkg})`).join('\n')}

## Getting Started

To get started, install the CLI tool:

\`\`\`bash
npm install -g @pjt/cli
\`\`\`

Then run it in your project directory:

\`\`\`bash
pjt
\`\`\`
`;

  const html = await markdownToHtml(markdown);

  return {
    html,
    data: {
      title: 'Welcome to PJT',
      description: 'A powerful cross-platform CLI tool for maintaining clean Git repositories',
    },
  };
}