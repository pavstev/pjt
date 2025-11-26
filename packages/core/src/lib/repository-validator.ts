/**
 * Repository validation utilities for OpenAgents
 */

import { promises as fs } from "node:fs";
import { join, relative } from "node:path";

import type { Logger } from "./logger";

export interface ValidationResult {
  success: boolean;
  message: string;
  details?: any;
}

export interface ValidationReport {
  summary: {
    totalValidated: number;
    passed: number;
    warnings: number;
    errors: number;
    coverage: number;
  };
  sections: {
    registry: ValidationResult[];
    components: ValidationResult[];
    profiles: ValidationResult[];
    documentation: ValidationResult[];
    context: ValidationResult[];
    dependencies: ValidationResult[];
  };
  recommendations: string[];
}

export interface RegistryData {
  version: string;
  repository: {
    name: string;
    url: string;
    description: string;
  };
  categories: Record<
    string,
    {
      name: string;
      description: string;
      priority: number;
    }
  >;
  components: Record<string, any[]>;
  profiles: Record<
    string,
    {
      name: string;
      description: string;
      components: string[];
      metadata?: any;
    }
  >;
  metadata: {
    lastUpdated: string;
    totalComponents: number;
    schemaVersion: string;
    maintainers?: any[];
  };
}

export class RepositoryValidator {
  private logger: Logger;
  private workspaceRoot: string;

  constructor(logger: Logger, workspaceRoot: string) {
    this.logger = logger;
    this.workspaceRoot = workspaceRoot;
  }

  /**
   * Run comprehensive repository validation
   */
  async validateRepository(): Promise<ValidationReport> {
    this.logger.info("Starting comprehensive repository validation...");

    const report: ValidationReport = {
      summary: {
        totalValidated: 0,
        passed: 0,
        warnings: 0,
        errors: 0,
        coverage: 0,
      },
      sections: {
        registry: [],
        components: [],
        profiles: [],
        documentation: [],
        context: [],
        dependencies: [],
      },
      recommendations: [],
    };

    try {
      // 1. Validate Registry JSON
      const registryValidation = await this.validateRegistry();
      report.sections.registry = registryValidation.results;
      this.updateSummary(report, registryValidation.results);

      if (!registryValidation.success) {
        this.logger.error(
          "Registry validation failed, cannot continue with other validations",
        );
        return report;
      }

      const registry = registryValidation.registry!;

      // 2. Validate Components
      const componentValidation = await this.validateComponents(registry);
      report.sections.components = componentValidation;
      this.updateSummary(report, componentValidation);

      // 3. Validate Profiles
      const profileValidation = await this.validateProfiles(registry);
      report.sections.profiles = profileValidation;
      this.updateSummary(report, profileValidation);

      // 4. Validate Documentation
      const docValidation = await this.validateDocumentation(registry);
      report.sections.documentation = docValidation;
      this.updateSummary(report, docValidation);

      // 5. Validate Context Files
      const contextValidation = await this.validateContextFiles(registry);
      report.sections.context = contextValidation;
      this.updateSummary(report, contextValidation);

      // 6. Validate Dependencies
      const dependencyValidation = await this.validateDependencies(registry);
      report.sections.dependencies = dependencyValidation;
      this.updateSummary(report, dependencyValidation);

      // Calculate coverage
      report.summary.coverage =
        report.summary.totalValidated > 0
          ? Math.round(
              (report.summary.passed / report.summary.totalValidated) * 100,
            )
          : 0;

      // Generate recommendations
      report.recommendations = this.generateRecommendations(report);

      this.logger.info(
        `Validation complete: ${report.summary.coverage}% coverage`,
      );
    } catch (error) {
      this.logger.error(`Validation failed: ${error}`);
      report.sections.registry.push({
        success: false,
        message: `Validation process failed: ${error}`,
      });
    }

    return report;
  }

  /**
   * Validate registry JSON structure and syntax
   */
  private async validateRegistry(): Promise<{
    success: boolean;
    registry?: RegistryData;
    results: ValidationResult[];
  }> {
    const results: ValidationResult[] = [];

    try {
      // Read and parse registry.json
      const registryPath = join(this.workspaceRoot, "registry.json");
      const registryContent = await fs.readFile(registryPath, "utf-8");
      const registry: RegistryData = JSON.parse(registryContent);

      results.push({
        success: true,
        message: "Registry JSON syntax is valid",
      });

      // Validate required fields
      const requiredFields = [
        "version",
        "repository",
        "categories",
        "components",
        "profiles",
        "metadata",
      ];
      for (const field of requiredFields) {
        if (!(field in registry)) {
          results.push({
            success: false,
            message: `Missing required field: ${field}`,
          });
        } else {
          results.push({
            success: true,
            message: `Required field present: ${field}`,
          });
        }
      }

      // Validate repository structure
      if (registry.repository) {
        const repoFields = ["name", "url", "description"];
        for (const field of repoFields) {
          if (!(field in registry.repository)) {
            results.push({
              success: false,
              message: `Missing repository field: ${field}`,
            });
          }
        }
      }

      // Validate components structure
      if (registry.components) {
        const componentTypes = [
          "agents",
          "subagents",
          "commands",
          "tools",
          "plugins",
          "contexts",
          "packages",
          "skills",
          "configs",
        ];
        for (const type of componentTypes) {
          if (!(type in registry.components)) {
            results.push({
              success: false,
              message: `Missing component type: ${type}`,
            });
          } else {
            results.push({
              success: true,
              message: `Component type present: ${type}`,
            });
          }
        }
      }

      // Validate profiles structure
      if (registry.profiles) {
        const profileNames = [
          "essential",
          "developer",
          "business",
          "full",
          "advanced",
        ];
        for (const profile of profileNames) {
          if (!(profile in registry.profiles)) {
            results.push({
              success: false,
              message: `Missing profile: ${profile}`,
            });
          } else {
            results.push({
              success: true,
              message: `Profile present: ${profile}`,
            });
          }
        }
      }

      // Validate metadata
      if (registry.metadata) {
        const metadataFields = [
          "lastUpdated",
          "totalComponents",
          "schemaVersion",
        ];
        for (const field of metadataFields) {
          if (!(field in registry.metadata)) {
            results.push({
              success: false,
              message: `Missing metadata field: ${field}`,
            });
          }
        }
      }

      const success = results.every(r => r.success);
      return { success, registry, results };
    } catch (error) {
      results.push({
        success: false,
        message: `Failed to parse registry.json: ${error}`,
      });
      return { success: false, results };
    }
  }

  /**
   * Validate all component definitions
   */
  private async validateComponents(
    registry: RegistryData,
  ): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const allComponents: Record<string, any> = {};
    const componentIds = new Set<string>();

    // Collect all components and check for duplicates
    for (const [type, components] of Object.entries(registry.components)) {
      for (const component of components) {
        const componentId = `${type.slice(0, -1)}:${component.id}`; // Remove 's' and add colon

        if (componentIds.has(component.id)) {
          results.push({
            success: false,
            message: `Duplicate component ID: ${component.id}`,
          });
        } else {
          componentIds.add(component.id);
          allComponents[component.id] = {
            ...component,
            type: type.slice(0, -1),
          };
        }

        // Validate required fields
        const requiredFields = [
          "id",
          "name",
          "description",
          "tags",
          "dependencies",
          "category",
        ];
        for (const field of requiredFields) {
          if (!(field in component)) {
            results.push({
              success: false,
              message: `Component ${component.id} missing required field: ${field}`,
            });
          }
        }

        // Validate category exists
        if (
          component.category &&
          !(component.category in registry.categories)
        ) {
          results.push({
            success: false,
            message: `Component ${component.id} has invalid category: ${component.category}`,
          });
        }

        // Check file exists
        if (component.path) {
          const fullPath = join(this.workspaceRoot, component.path);
          try {
            await fs.access(fullPath);
            results.push({
              success: true,
              message: `Component file exists: ${component.path}`,
            });
          } catch {
            results.push({
              success: false,
              message: `Component file missing: ${component.path}`,
            });
          }
        }
      }
    }

    results.push({
      success: true,
      message: `Validated ${componentIds.size} unique components`,
    });

    return results;
  }

  /**
   * Validate profile consistency
   */
  private async validateProfiles(
    registry: RegistryData,
  ): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const allComponentIds = new Set<string>();

    // Collect all component IDs
    for (const components of Object.values(registry.components)) {
      for (const component of components) {
        allComponentIds.add(component.id);
      }
    }

    // Validate each profile
    for (const [profileName, profile] of Object.entries(registry.profiles)) {
      const profileComponents = new Set(profile.components);

      // Check for duplicate components in profile
      if (profileComponents.size !== profile.components.length) {
        results.push({
          success: false,
          message: `Profile ${profileName} has duplicate components`,
        });
      }

      // Check all components exist
      for (const componentId of profile.components) {
        if (!allComponentIds.has(componentId)) {
          results.push({
            success: false,
            message: `Profile ${profileName} references non-existent component: ${componentId}`,
          });
        }
      }

      results.push({
        success: true,
        message: `Profile ${profileName} has ${profile.components.length} components`,
      });
    }

    return results;
  }

  /**
   * Validate documentation consistency
   */
  private async validateDocumentation(
    registry: RegistryData,
  ): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    // Check README.md component counts
    try {
      const readmePath = join(this.workspaceRoot, "README.md");
      const readmeContent = await fs.readFile(readmePath, "utf-8");

      // This is a simplified check - in practice you'd parse the actual profile descriptions
      results.push({
        success: true,
        message: "README.md exists and is readable",
      });
    } catch {
      results.push({
        success: false,
        message: "README.md not found or unreadable",
      });
    }

    // Check installation guide
    try {
      const installPath = join(
        this.workspaceRoot,
        "packages/docs/src/content/docs/getting-started/installation.md",
      );
      const installContent = await fs.readFile(installPath, "utf-8");

      // Check for profile descriptions
      const profiles = [
        "Essential",
        "Developer",
        "Business",
        "Full",
        "Advanced",
      ];
      for (const profile of profiles) {
        if (installContent.includes(`#### ${profile} Profile`)) {
          results.push({
            success: true,
            message: `Installation guide mentions ${profile} profile`,
          });
        } else {
          results.push({
            success: false,
            message: `Installation guide missing ${profile} profile description`,
          });
        }
      }
    } catch {
      results.push({
        success: false,
        message: "Installation guide not found or unreadable",
      });
    }

    // Check OpenAgent documentation
    try {
      const openagentPath = join(
        this.workspaceRoot,
        "packages/docs/src/content/docs/agents/openagent.md",
      );
      const openagentContent = await fs.readFile(openagentPath, "utf-8");

      if (openagentContent.includes("Delegation Criteria")) {
        results.push({
          success: true,
          message: "OpenAgent documentation includes delegation criteria",
        });
      } else {
        results.push({
          success: false,
          message: "OpenAgent documentation missing delegation criteria",
        });
      }
    } catch {
      results.push({
        success: false,
        message: "OpenAgent documentation not found or unreadable",
      });
    }

    return results;
  }

  /**
   * Validate context file structure
   */
  private async validateContextFiles(
    registry: RegistryData,
  ): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    // Get all context components
    const contextComponents = registry.components.contexts || [];
    const expectedPaths = new Set(contextComponents.map(c => c.path));
    const foundPaths = new Set<string>();

    // Find all context files
    const contextDir = join(this.workspaceRoot, "packages/opencode/context");
    try {
      const files = await this.getAllFiles(contextDir);
      for (const file of files) {
        const relativePath = relative(this.workspaceRoot, file);
        foundPaths.add(relativePath);

        if (!expectedPaths.has(relativePath)) {
          results.push({
            success: false,
            message: `Orphaned context file: ${relativePath}`,
            details: { type: "orphaned" },
          });
        }
      }
    } catch {
      results.push({
        success: false,
        message: "Context directory not found or inaccessible",
      });
      return results;
    }

    // Check for missing files
    for (const expectedPath of expectedPaths) {
      if (!foundPaths.has(expectedPath)) {
        results.push({
          success: false,
          message: `Missing context file: ${expectedPath}`,
          details: { type: "missing" },
        });
      } else {
        results.push({
          success: true,
          message: `Context file exists: ${expectedPath}`,
        });
      }
    }

    results.push({
      success: true,
      message: `Found ${foundPaths.size} context files, expected ${expectedPaths.size}`,
    });

    return results;
  }

  /**
   * Validate component dependencies
   */
  private async validateDependencies(
    registry: RegistryData,
  ): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const allComponentIds = new Set<string>();

    // Collect all component IDs with their types
    const componentMap = new Map<string, string>();
    for (const [type, components] of Object.entries(registry.components)) {
      const componentType = type.slice(0, -1); // Remove 's'
      for (const component of components) {
        allComponentIds.add(component.id);
        componentMap.set(component.id, componentType);
      }
    }

    // Check dependencies
    for (const [type, components] of Object.entries(registry.components)) {
      for (const component of components) {
        if (component.dependencies && component.dependencies.length > 0) {
          for (const dep of component.dependencies) {
            // Parse dependency format: type:id
            const depMatch = dep.match(/^([^:]+):(.+)$/);
            if (!depMatch) {
              results.push({
                success: false,
                message: `Invalid dependency format in ${component.id}: ${dep}`,
              });
              continue;
            }

            const [, depType, depId] = depMatch;
            const fullDepId = `${depType}:${depId}`;

            if (!allComponentIds.has(depId)) {
              results.push({
                success: false,
                message: `Broken dependency in ${component.id}: ${fullDepId} not found`,
              });
            } else {
              results.push({
                success: true,
                message: `Valid dependency: ${component.id} -> ${fullDepId}`,
              });
            }
          }
        }
      }
    }

    results.push({
      success: true,
      message: `Validated dependencies for ${allComponentIds.size} components`,
    });

    return results;
  }

  /**
   * Generate recommendations based on validation results
   */
  private generateRecommendations(report: ValidationReport): string[] {
    const recommendations: string[] = [];

    // Check for errors first
    if (report.summary.errors > 0) {
      recommendations.push(
        "🔴 Fix all errors before proceeding - these indicate broken functionality",
      );
    }

    // Check for missing files
    const missingFiles = report.sections.components.filter(
      r =>
        r.message.includes("Component file missing") ||
        r.message.includes("Missing context file"),
    );
    if (missingFiles.length > 0) {
      recommendations.push(
        `📁 Create ${missingFiles.length} missing component/context files`,
      );
    }

    // Check for orphaned files
    const orphanedFiles = report.sections.context.filter(
      r => r.details?.type === "orphaned",
    );
    if (orphanedFiles.length > 0) {
      recommendations.push(
        `🗑️ Remove or register ${orphanedFiles.length} orphaned context files`,
      );
    }

    // Check for broken dependencies
    const brokenDeps = report.sections.dependencies.filter(r =>
      r.message.includes("Broken dependency"),
    );
    if (brokenDeps.length > 0) {
      recommendations.push(
        `🔗 Fix ${brokenDeps.length} broken component dependencies`,
      );
    }

    // General improvements
    if (report.summary.warnings > 0) {
      recommendations.push("⚠️ Address warnings to improve repository quality");
    }

    if (report.summary.coverage < 95) {
      recommendations.push(
        "📊 Improve validation coverage by addressing missing validations",
      );
    }

    return recommendations;
  }

  /**
   * Update summary statistics
   */
  private updateSummary(
    report: ValidationReport,
    results: ValidationResult[],
  ): void {
    for (const result of results) {
      report.summary.totalValidated++;
      if (result.success) {
        report.summary.passed++;
      } else if (
        result.message.includes("Missing") ||
        result.message.includes("Broken") ||
        result.message.includes("Invalid")
      ) {
        report.summary.errors++;
      } else {
        report.summary.warnings++;
      }
    }
  }

  /**
   * Recursively get all files in a directory
   */
  private async getAllFiles(dirPath: string): Promise<string[]> {
    const files: string[] = [];

    async function traverse(currentPath: string): Promise<void> {
      const items = await fs.readdir(currentPath, { withFileTypes: true });

      for (const item of items) {
        const fullPath = join(currentPath, item.name);
        if (item.isDirectory()) {
          await traverse(fullPath);
        } else if (item.isFile()) {
          files.push(fullPath);
        }
      }
    }

    await traverse(dirPath);
    return files;
  }
}
