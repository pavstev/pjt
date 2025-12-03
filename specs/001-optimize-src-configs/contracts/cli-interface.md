# CLI Interface Contract: Code Analysis and Optimization

**Version**: 1.0.0
**Date**: Thu Nov 27 2025
**Feature**: 001-optimize-src-configs

## Overview

This contract defines the command-line interface for code analysis and optimization functionality. The interface follows the existing CLI patterns in the pjt project.

## Commands

### analyze

Analyzes source code and configuration files for optimization opportunities.

**Usage**:

```bash
pjt analyze [options] [directory]
```

**Parameters**:

- `directory`: Target directory to analyze (default: current working directory)

**Options**:

- `--format <format>`: Output format ('json' | 'text' | 'table') (default: 'text')
- `--include <patterns>`: File patterns to include (comma-separated globs)
- `--exclude <patterns>`: File patterns to exclude (comma-separated globs)
- `--depth <number>`: Maximum directory depth to analyze (default: unlimited)
- `--report-file <path>`: Path to save detailed report (optional)
- `--quiet`: Suppress progress output
- `--help`: Display help information

**Output**:

- **Success (exit code 0)**: Analysis report with optimization suggestions
- **Error (exit code 1)**: Analysis failed with error message

**Examples**:

```bash
# Analyze current directory
pjt analyze

# Analyze specific directory with JSON output
pjt analyze src/ --format json

# Analyze with custom patterns and save report
pjt analyze --include "*.ts,*.js" --exclude "node_modules/**,dist/**" --report-file analysis.json
```

### optimize

Applies safe optimizations to source code and configuration files.

**Usage**:

```bash
pjt optimize [options] [directory]
```

**Parameters**:

- `directory`: Target directory to optimize (default: current working directory)

**Options**:

- `--dry-run`: Show what would be changed without applying changes
- `--backup`: Create backup files before optimization
- `--include <patterns>`: File patterns to include (comma-separated globs)
- `--exclude <patterns>`: File patterns to exclude (comma-separated globs)
- `--risk-level <level>`: Maximum risk level to apply ('low' | 'medium' | 'high') (default: 'low')
- `--confirm`: Require user confirmation for each change
- `--report-file <path>`: Path to save optimization report
- `--quiet`: Suppress progress output
- `--help`: Display help information

**Output**:

- **Success (exit code 0)**: Optimization completed with summary
- **Error (exit code 1)**: Optimization failed with error message
- **Partial (exit code 2)**: Some optimizations failed, others succeeded

**Examples**:

```bash
# Dry run optimization
pjt optimize --dry-run

# Apply low-risk optimizations with backup
pjt optimize --risk-level low --backup

# Optimize with confirmation and custom patterns
pjt optimize --include "package.json,vite.config.ts" --confirm
```

## Data Formats

### Analysis Report (JSON)

```typescript
interface AnalysisReport {
  timestamp: string;
  projectRoot: string;
  summary: {
    totalFiles: number;
    totalLOC: number;
    duplicatesFound: number;
    optimizationsSuggested: number;
    riskLevel: "low" | "medium" | "high";
  };
  duplicates: DuplicateFinding[];
  configOptimizations: ConfigOptimization[];
  scriptOptimizations: ScriptOptimization[];
  recommendations: string[];
}

interface DuplicateFinding {
  type: "exact" | "near" | "structural";
  files: string[];
  lines: number;
  confidence: number;
  suggestion: string;
}

interface ConfigOptimization {
  file: string;
  property: string;
  currentValue: any;
  suggestedValue: any;
  benefit: string;
  risk: "low" | "medium" | "high";
}

interface ScriptOptimization {
  scriptName: string;
  currentCommand: string;
  suggestedCommand: string;
  benefit: string;
  risk: "low" | "medium" | "high";
}
```

### Optimization Report (JSON)

```typescript
interface OptimizationReport {
  timestamp: string;
  projectRoot: string;
  summary: {
    changesApplied: number;
    changesSkipped: number;
    backupCreated: boolean;
    riskLevel: string;
  };
  appliedOptimizations: AppliedOptimization[];
  skippedOptimizations: SkippedOptimization[];
  validationResults: ValidationResult[];
}

interface AppliedOptimization {
  type: "config" | "script" | "code";
  file: string;
  description: string;
  backupPath?: string;
}

interface SkippedOptimization {
  type: "config" | "script" | "code";
  file: string;
  reason: string;
  risk: "low" | "medium" | "high";
}

interface ValidationResult {
  file: string;
  status: "passed" | "failed" | "warning";
  message: string;
  details?: any;
}
```

## Error Handling

### Error Codes

- `0`: Success
- `1`: General error (invalid arguments, analysis failed)
- `2`: Partial success (some optimizations failed)
- `10`: Permission denied (cannot read/write files)
- `11`: Invalid configuration (malformed config files)
- `12`: Analysis timeout (took too long)
- `13`: Validation failed (optimizations broke functionality)

### Error Messages

All error messages follow the format:

```
Error: [Descriptive message]
Details: [Additional context]
Suggestion: [How to resolve]
```

## Integration Requirements

### File System Access

- Read access to source files and configuration files
- Write access to configuration files (for optimization)
- Create backup files in same directory (optional)

### External Dependencies

- Node.js built-in modules (fs, path, etc.)
- Existing project dependencies (execa, consola, etc.)
- Optional: jscpd for duplicate detection (if not bundled)

### Performance Requirements

- Analysis completes within 5 minutes for typical projects (< 100k LOC)
- Memory usage stays under 500MB during analysis
- No persistent background processes

### Compatibility

- Cross-platform (Linux, macOS, Windows)
- Node.js 18.0.0+
- Compatible with existing pjt commands
