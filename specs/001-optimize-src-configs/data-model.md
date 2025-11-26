# Data Model: Optimize Source Code and Configuration Files

**Date**: Thu Nov 27 2025  
**Feature**: 001-optimize-src-configs  
**Purpose**: Define core entities and relationships for code analysis and optimization system

## CodeFile Entity

Represents a source code file in the analyzed codebase.

**Attributes**:

- `path`: string - Absolute file path
- `relativePath`: string - Path relative to project root
- `extension`: string - File extension (e.g., '.ts', '.js')
- `size`: number - File size in bytes
- `lines`: number - Total lines of code
- `language`: string - Programming language ('typescript', 'javascript', etc.)
- `complexity`: number - Cyclomatic complexity score
- `imports`: string[] - List of imported modules
- `exports`: string[] - List of exported symbols
- `functions`: FunctionInfo[] - Array of function definitions
- `classes`: ClassInfo[] - Array of class definitions

**Relationships**:

- Belongs to OptimizationReport (many-to-one)
- References other CodeFiles via imports

**Validation Rules**:

- Path must be absolute and exist
- Size must be positive integer
- Language must be supported ('typescript' | 'javascript')
- Complexity calculated using standard metrics

**State Transitions**:

- Created during analysis phase
- Updated during optimization phase
- Archived after processing

## ConfigFile Entity

Represents configuration files (package.json, vite.config.ts) targeted for optimization.

**Attributes**:

- `path`: string - Absolute file path
- `type`: string - Config type ('package.json' | 'vite.config.ts' | 'tsconfig.json')
- `content`: object - Parsed configuration object
- `size`: number - File size in bytes
- `lastModified`: Date - Last modification timestamp
- `dependencies`: DependencyInfo[] - Runtime dependencies
- `devDependencies`: DependencyInfo[] - Development dependencies
- `scripts`: ScriptInfo[] - Defined npm scripts
- `buildConfig`: BuildConfigInfo - Build-specific configuration

**Relationships**:

- Belongs to OptimizationReport (many-to-one)
- Contains DependencyInfo and ScriptInfo entities

**Validation Rules**:

- Type must be supported configuration file
- Content must be valid JSON/TS for respective type
- Dependencies follow SemVer format
- Scripts are valid shell commands

**State Transitions**:

- Loaded during analysis
- Modified during optimization
- Validated after changes

## OptimizationReport Entity

Contains analysis results and optimization suggestions.

**Attributes**:

- `id`: string - Unique report identifier
- `timestamp`: Date - Analysis timestamp
- `projectRoot`: string - Project root directory
- `totalFiles`: number - Total files analyzed
- `totalLOC`: number - Total lines of code
- `duplicates`: DuplicateInfo[] - Detected code duplicates
- `unusedDeps`: string[] - Unused dependencies
- `scriptOptimizations`: ScriptOptimization[] - Script improvement suggestions
- `configOptimizations`: ConfigOptimization[] - Configuration improvements
- `riskLevel`: 'low' | 'medium' | 'high' - Overall risk assessment
- `estimatedSavings`: SavingsEstimate - Performance/code savings

**Relationships**:

- Contains multiple CodeFile entities
- Contains multiple ConfigFile entities
- Aggregates DuplicateInfo, ScriptOptimization, ConfigOptimization

**Validation Rules**:

- ID must be unique UUID
- Timestamp must be valid Date
- Risk level based on suggested changes
- Estimated savings calculated from metrics

**State Transitions**:

- Created during analysis
- Updated with optimization results
- Finalized after validation

## Supporting Entities

### FunctionInfo

- `name`: string
- `startLine`: number
- `endLine`: number
- `parameters`: string[]
- `complexity`: number
- `duplicateOf`: string | null - Reference to duplicate function

### ClassInfo

- `name`: string
- `startLine`: number
- `endLine`: number
- `methods`: string[]
- `properties`: string[]

### DependencyInfo

- `name`: string
- `version`: string
- `isUsed`: boolean
- `usageCount`: number

### ScriptInfo

- `name`: string
- `command`: string
- `isEfficient`: boolean
- `suggestions`: string[]

### DuplicateInfo

- `type`: 'exact' | 'near' | 'structural'
- `files`: string[] - Affected file paths
- `lines`: number - Lines of duplicated code
- `confidence`: number - Detection confidence (0-1)

### ScriptOptimization

- `scriptName`: string
- `currentCommand`: string
- `suggestedCommand`: string
- `benefit`: string
- `risk`: 'low' | 'medium' | 'high'

### ConfigOptimization

- `configType`: string
- `property`: string
- `currentValue`: any
- `suggestedValue`: any
- `benefit`: string
- `risk`: 'low' | 'medium' | 'high'

### SavingsEstimate

- `timeReduction`: number - Build time savings in seconds
- `sizeReduction`: number - Bundle size reduction in KB
- `complexityReduction`: number - Complexity score reduction
- `maintenanceHours`: number - Estimated maintenance time savings
