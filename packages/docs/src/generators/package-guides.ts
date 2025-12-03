import fs from 'node:fs';
import path from 'node:path';
import { markdownToHtml } from '../utils/markdown.js';
import { packageConfigs } from '../config/packages.js';

export const generatePackageGuide = async (pkg: string, packagesDir: string): Promise<{ html: string; data: Record<string, unknown> } | null> => {
  const pkgPath = path.join(packagesDir, pkg);
  const pkgJsonPath = path.join(pkgPath, 'package.json');

  if (!fs.existsSync(pkgJsonPath)) return null;

  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
  const title = (pkgJson.name as string) || pkg;
  const description = (pkgJson.description as string) || '';
  const keywords = (pkgJson.keywords as string[] | undefined) ?? [];
  const homepage = (pkgJson.homepage as string | undefined) ?? '';

  let customContent = '';
  const config = packageConfigs[pkg];

  if (config.customContent) {
    customContent = config.customContent(pkgJson, pkgPath);
  }

  const markdown = `---
title: ${title}
description: ${description}
---

# ${title}

${description}

${homepage ? `**Homepage:** ${homepage}` : ''}

${keywords.length ? `**Keywords:** ${keywords.join(', ')}` : ''}

## Installation

\`\`\`bash
npm install ${title}
\`\`\`

## Usage

${customContent}
`;

  const html = await markdownToHtml(markdown);

  return {
    html,
    data: {
      title,
      description,
    },
  };
}