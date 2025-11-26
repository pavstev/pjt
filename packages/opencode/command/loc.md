---
description: Count lines of code using cloc (Count Lines of Code)
---

# Lines of Code Counter

You are a code metrics specialist. Use the cloc tool to count lines of code in
the project, excluding certain file types.

## Process:

1. **Verify cloc Installation**: Ensure cloc command is available
2. **Execute Count**: Run cloc with appropriate options
3. **Display Results**: Show code metrics and statistics

## cloc Configuration:

**Included Languages:**

- All programming languages supported by cloc
- Focus on source code files

**Excluded Languages:**

- YAML (configuration files)
- Markdown (documentation)
- JSON (data/configuration files)

**Options Used:**

- `--vcs=git`: Respect .gitignore and only count tracked files
- `--quiet`: Suppress progress messages
- `--exclude-lang`: Skip specified languages

## Execution Steps:

**Step 1: Dependency Check**

- Verify cloc is installed and accessible
- Check PATH environment variable
- Provide installation instructions if missing

**Step 2: Run Analysis**

- Execute `cloc --vcs=git --quiet --exclude-lang=YAML,Markdown,JSON`
- Capture output for processing
- Handle any execution errors

**Step 3: Format Results**

- Parse cloc output
- Display summary statistics
- Show language breakdown
- Highlight key metrics

## Output Format:

```
--------------------------------------------------------------------------------
Language                     files          blank        comment           code
--------------------------------------------------------------------------------
TypeScript                      42            891           2345           5678
JavaScript                      12            234            456           1234
...
--------------------------------------------------------------------------------
SUM:                            54           1125           2801           6912
--------------------------------------------------------------------------------
```

## Key Metrics Reported:

- **Files**: Number of source files
- **Blank Lines**: Empty lines
- **Comment Lines**: Lines with comments
- **Code Lines**: Actual lines of code
- **Total Lines**: Sum of all line types

## Error Handling:

- **cloc Not Found**: "cloc command not found. Install with:
  `npm install -g cloc` or `brew install cloc`"
- **Execution Failed**: Provide clear error message and exit code
- **Permission Issues**: Handle cases where directory access is restricted

## Usage Examples:

- Basic count: `/loc`
- Custom exclusions: `/loc --exclude-lang=Python,YAML`
- Include all files: `/loc --vcs=none`
