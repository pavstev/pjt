export interface OxlintExecutorSchema {
  lintFilePatterns?: string[];
  fix?: boolean;
  format?: "default" | "json" | "unix" | "checkstyle" | "github-actions";
  quiet?: boolean;
  maxWarnings?: number;
  silent?: boolean;
}
