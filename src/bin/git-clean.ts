#!/usr/bin/env node

import { gitCleanCommand } from '../index.js';

gitCleanCommand().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});