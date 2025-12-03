# Quickstart: Code Analysis and Optimization

**Date**: Thu Nov 27 2025
**Feature**: 001-optimize-src-configs
**Audience**: Developers using pjt CLI

## Prerequisites

- Node.js 18.0.0 or higher
- pjt CLI installed (`npm install -g pjt`)
- Project with TypeScript/JavaScript source code

## Quick Analysis

Analyze your codebase for optimization opportunities:

```bash
# Analyze current directory
pjt analyze

# Analyze specific directory with detailed output
pjt analyze src/ --format table

# Save analysis report to file
pjt analyze --report-file analysis-report.json
```

## Safe Optimization

Apply low-risk optimizations with backup:

```bash
# Preview changes without applying them
pjt optimize --dry-run

# Apply optimizations with automatic backup
pjt optimize --backup --risk-level low

# Optimize with user confirmation for each change
pjt optimize --confirm
```

## Common Workflows

### 1. Full Codebase Review

```bash
# Step 1: Analyze the entire project
pjt analyze --format json --report-file full-analysis.json

# Step 2: Review the report and decide on risk level
# (Open full-analysis.json in your editor)

# Step 3: Apply safe optimizations
pjt optimize --risk-level low --backup --report-file optimization-results.json
```

### 2. Configuration-Only Optimization

```bash
# Focus on package.json and vite.config.ts
pjt analyze --include "package.json,vite.config.ts" --format table

# Apply configuration optimizations only
pjt optimize --include "package.json,vite.config.ts" --confirm
```

### 3. CI/CD Integration

Add to your CI pipeline for automated analysis:

```yaml
# .github/workflows/analyze.yml
name: Code Analysis
on: [push, pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "18"
      - run: npm install -g pjt
      - run: pjt analyze --format json --report-file analysis.json
      - uses: actions/upload-artifact@v4
        with:
          name: analysis-report
          path: analysis.json
```

## Understanding Output

### Analysis Report

The analysis provides:

- **Duplicate Code**: Files with similar code blocks
- **Unused Dependencies**: Packages not referenced in code
- **Script Efficiency**: Suggestions for npm script improvements
- **Configuration Optimizations**: Changes to package.json/vite.config.ts

### Risk Levels

- **Low Risk**: Safe changes like removing unused dependencies
- **Medium Risk**: Script optimizations that might affect build process
- **High Risk**: Code refactoring that could change behavior

## Troubleshooting

### Analysis Takes Too Long

```bash
# Limit analysis depth
pjt analyze --depth 3

# Exclude large directories
pjt analyze --exclude "node_modules/**,dist/**,.git/**"
```

### Permission Errors

```bash
# Run with appropriate permissions
sudo pjt optimize --backup

# Or analyze read-only
pjt analyze --exclude "protected/**"
```

### Build Breaks After Optimization

```bash
# Restore from backup (if created)
# Check optimization-results.json for applied changes
# Manually revert problematic changes

# Re-run with lower risk level
pjt optimize --risk-level low
```

## Next Steps

- Review analysis reports regularly
- Start with low-risk optimizations
- Integrate into development workflow
- Monitor build performance improvements

For detailed command options: `pjt analyze --help` or `pjt optimize --help`
