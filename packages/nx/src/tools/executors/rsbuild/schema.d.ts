export interface RsbuildExecutorSchema {
  /**
   * Path to rsbuild.config file
   * @default "rsbuild.config.ts"
   */
  configPath?: string;

  /**
   * Build mode
   * @default "production"
   */
  mode?: "development" | "production";

  /**
   * Enable watch mode
   * @default false
   */
  watch?: boolean;

  /**
   * Output directory for build artifacts
   * @default "dist/{projectRoot}"
   */
  outputPath?: string;

  /**
   * Build target
   * @default "web"
   */
  target?: "web" | "node" | "web-worker";

  /**
   * Environment name for multi-environment builds
   */
  environment?: string;

  /**
   * Enable bundle analysis
   * @default false
   */
  analyze?: boolean;

  /**
   * Enable build profiling
   * @default false
   */
  profile?: boolean;
}
