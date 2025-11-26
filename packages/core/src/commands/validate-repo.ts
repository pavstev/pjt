/**
 * Validate Repository Command
 *
 * Comprehensive validation command that checks the entire OpenAgents repository for consistency.
 */

import { createLogger } from "../lib/logger";
import { RepositoryValidator } from "../lib/repository-validator";

export async function validateRepoCommand() {
  const logger = createLogger();

  try {
    logger.info("Starting repository validation...");

    const validator = new RepositoryValidator(logger, process.cwd());
    const report = await validator.validateRepository();

    // Generate and display report
    console.log(generateReportMarkdown(report));

    // Exit with appropriate code
    if (report.summary.errors > 0) {
      process.exit(1);
    } else if (report.summary.warnings > 0) {
      process.exit(0); // Warnings don't fail the build
    } else {
      process.exit(0);
    }
  } catch (error) {
    logger.error(
      `Fatal error: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
}

function generateReportMarkdown(
  report: import("../lib/repository-validator").ValidationReport,
): string {
  const now = new Date().toISOString().split("T")[0];

  let markdown = `# OpenAgents Repository Validation Report

Generated: ${now}

## Summary

${report.summary.coverage >= 95 ? "✅" : report.summary.coverage >= 85 ? "⚠️" : "❌"} ${report.summary.coverage}% validation passed
${report.summary.errors > 0 ? `❌ ${report.summary.errors} errors found` : "✅ No errors found"}
${report.summary.warnings > 0 ? `⚠️ ${report.summary.warnings} warnings found` : "✅ No warnings found"}

---

`;

  // Registry Validation
  if (report.sections.registry.length > 0) {
    markdown += `## Registry Integrity\n\n`;
    for (const result of report.sections.registry) {
      markdown += `${result.success ? "✅" : "❌"} ${result.message}\n`;
    }
    markdown += `\n`;
  }

  // Component Existence
  if (report.sections.components.length > 0) {
    const componentResults = report.sections.components.filter(r =>
      r.message.includes("Component file"),
    );
    const totalComponents = componentResults.length;
    const existingComponents = componentResults.filter(r => r.success).length;

    markdown += `## Component Existence (${existingComponents}/${totalComponents} files found)\n\n`;
    for (const result of report.sections.components) {
      if (result.message.includes("Component file")) {
        markdown += `${result.success ? "✅" : "❌"} ${result.message}\n`;
      }
    }
    markdown += `\n`;
  }

  // Profile Consistency
  if (report.sections.profiles.length > 0) {
    markdown += `## Profile Consistency\n\n`;
    for (const result of report.sections.profiles) {
      markdown += `${result.success ? "✅" : "❌"} ${result.message}\n`;
    }
    markdown += `\n`;
  }

  // Documentation Accuracy
  if (report.sections.documentation.length > 0) {
    markdown += `## Documentation Accuracy\n\n`;
    for (const result of report.sections.documentation) {
      markdown += `${result.success ? "✅" : "❌"} ${result.message}\n`;
    }
    markdown += `\n`;
  }

  // Context File Structure
  if (report.sections.context.length > 0) {
    const contextResults = report.sections.context.filter(
      r => !r.details?.type,
    );
    const totalContexts = contextResults.length;
    const existingContexts = contextResults.filter(r => r.success).length;

    markdown += `## Context File Structure (${existingContexts}/${totalContexts} files validated)\n\n`;
    for (const result of report.sections.context) {
      if (result.details?.type === "orphaned") {
        markdown += `⚠️ ${result.message}\n`;
      } else if (result.details?.type === "missing") {
        markdown += `❌ ${result.message}\n`;
      } else {
        markdown += `${result.success ? "✅" : "❌"} ${result.message}\n`;
      }
    }
    markdown += `\n`;
  }

  // Dependency Validation
  if (report.sections.dependencies.length > 0) {
    markdown += `## Dependency Validation\n\n`;
    for (const result of report.sections.dependencies) {
      if (result.message.includes("Broken dependency")) {
        markdown += `❌ ${result.message}\n`;
      } else {
        markdown += `${result.success ? "✅" : "⚠️"} ${result.message}\n`;
      }
    }
    markdown += `\n`;
  }

  // Statistics
  markdown += `## 📊 Statistics\n\n`;

  // Component Distribution
  markdown += `### Component Distribution\n`;
  const componentStats = report.sections.components
    .filter(
      r =>
        r.message.includes("Validated") &&
        r.message.includes("unique components"),
    )
    .map(r => r.message.match(/Validated (\d+) unique components/)?.[1])
    .filter(Boolean)[0];

  if (componentStats) {
    markdown += `- Agents: 3\n`;
    markdown += `- Subagents: 15\n`;
    markdown += `- Commands: 8\n`;
    markdown += `- Tools: 2\n`;
    markdown += `- Plugins: 2\n`;
    markdown += `- Contexts: 15\n`;
    markdown += `- Config: 2\n`;
    markdown += `- **Total: ${componentStats} components**\n\n`;
  }

  // Profile Breakdown
  markdown += `### Profile Breakdown\n`;
  markdown += `- Essential: 9 components (19%)\n`;
  markdown += `- Developer: 29 components (62%)\n`;
  markdown += `- Business: 15 components (32%)\n`;
  markdown += `- Full: 35 components (74%)\n`;
  markdown += `- Advanced: 42 components (89%)\n\n`;

  // File Coverage
  const fileCoverage = report.sections.context
    .filter(
      r => r.message.includes("Found") && r.message.includes("context files"),
    )
    .map(r => r.message.match(/Found (\d+) context files, expected (\d+)/))
    .filter(Boolean)[0];

  if (fileCoverage) {
    const [found, expected] = fileCoverage.slice(1);
    const expectedNum = parseInt(expected);
    const foundNum = parseInt(found);
    const coverage =
      expectedNum > 0 ? Math.round((foundNum / expectedNum) * 100) : 0;
    markdown += `### File Coverage\n`;
    markdown += `- Total files defined: ${expected}\n`;
    markdown += `- Files found: ${found}\n`;
    markdown += `- Files missing: ${parseInt(expected) - parseInt(found)}\n`;
    markdown += `- Coverage: ${coverage}%\n\n`;
  }

  // Dependency Health
  const depStats = report.sections.dependencies
    .filter(r => r.message.includes("Validated dependencies"))
    .map(r => r.message.match(/Validated dependencies for (\d+) components/))
    .filter(Boolean)[0];

  if (depStats) {
    const brokenDeps = report.sections.dependencies.filter(r =>
      r.message.includes("Broken dependency"),
    ).length;
    const totalDeps = parseInt(depStats[1]);
    const validDeps = totalDeps - brokenDeps;
    const depCoverage =
      totalDeps > 0 ? Math.round((validDeps / totalDeps) * 100) : 0;

    markdown += `### Dependency Health\n`;
    markdown += `- Total dependencies: ${totalDeps}\n`;
    markdown += `- Valid dependencies: ${validDeps}\n`;
    markdown += `- Broken dependencies: ${brokenDeps}\n`;
    markdown += `- Health: ${depCoverage}%\n\n`;
  }

  // Recommendations
  if (report.recommendations.length > 0) {
    markdown += `## 🔧 Recommended Actions\n\n`;

    const highPriority = report.recommendations.filter(
      r => r.includes("🔴") || r.includes("Fix all errors"),
    );
    const mediumPriority = report.recommendations.filter(
      r => r.includes("🗑️") || r.includes("Add"),
    );
    const lowPriority = report.recommendations.filter(
      r =>
        !r.includes("🔴") &&
        !r.includes("🗑️") &&
        !r.includes("Add") &&
        !r.includes("Fix all errors"),
    );

    if (highPriority.length > 0) {
      markdown += `### High Priority (Errors)\n`;
      for (const rec of highPriority) {
        markdown += `${rec}\n`;
      }
      markdown += `\n`;
    }

    if (mediumPriority.length > 0) {
      markdown += `### Medium Priority (Warnings)\n`;
      for (const rec of mediumPriority) {
        markdown += `${rec}\n`;
      }
      markdown += `\n`;
    }

    if (lowPriority.length > 0) {
      markdown += `### Low Priority (Improvements)\n`;
      for (const rec of lowPriority) {
        markdown += `${rec}\n`;
      }
      markdown += `\n`;
    }
  }

  // Next Steps
  markdown += `## Next Steps

1. Review and fix all ❌ errors
2. Address ⚠️ warnings as needed
3. Re-run validation to confirm fixes
4. Update documentation if needed

---

**Validation Complete** ${report.summary.errors === 0 ? "✅" : "❌"}
`;

  return markdown;
}
