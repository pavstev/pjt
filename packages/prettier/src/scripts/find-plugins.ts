import { consola } from "consola";
// @ts-expect-error - libnpmsearch doesn't have types
import libnpmsearch from "libnpmsearch";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type {
  PluginCondition,
  PluginDefinition,
  PluginDefinitions,
} from "../schema/schema";

type NpmPackage = {
  name: string;
  version: string;
  description: string | null;
  maintainers: Array<{ username: string; email: string }> | null;
  keywords: string[] | null;
  date: Date | null;
};

type SearchOptions = {
  limit?: number;
  interactive?: boolean;
};

const FILE_PATTERN_MAPPINGS: Partial<Record<string, string[]>> = {
  xml: ["*.xml"],
  json: ["*.json", "*.jsonc", "*.json5"],
  yaml: ["*.yaml", "*.yml"],
  toml: ["*.toml"],
  py: ["*.py"],
  sql: ["*.sql"],
  sh: ["*.sh", "*.zsh", "*.bash"],
  dockerfile: ["*.dockerfile", "*.Dockerfile"],
  astro: ["*.astro"],
  svelte: ["*.svelte"],
  vue: ["*.vue"],
  md: ["*.md", "*.mdx", "*.svx"],
  css: ["*.css", "*.scss", "*.sass", "*.less"],
  prisma: ["*.prisma"],
  just: ["justfile", "*.just"],
};

const PARSER_MAPPINGS: Record<string, string> = {
  xml: "xml",
  json: "json",
  yaml: "yaml",
  toml: "toml",
  py: "py",
  sql: "sql",
  sh: "shell",
  dockerfile: "dockerfile",
  astro: "astro",
  svelte: "svelte",
  vue: "vue",
  md: "markdown",
  css: "css",
  prisma: "prisma",
  ts: "typescript",
  js: "babel",
  html: "html",
};

const detectFilePatterns = (
  name: string,
  keywords: string[] | null,
): string[] | undefined => {
  const lowerName = name.toLowerCase();
  const allKeywords = [
    ...Object.keys(FILE_PATTERN_MAPPINGS),
    ...(keywords ?? []),
  ];

  for (const keyword of allKeywords) {
    const lowerKeyword = keyword.toLowerCase();

    // Check if plugin name contains keyword
    if (lowerName.includes(lowerKeyword)) {
      const patterns = FILE_PATTERN_MAPPINGS[keyword];
      if (patterns) {
        return patterns;
      }
    }

    // Extract extension from prettier-plugin-{extension} pattern
    const match = lowerName.match(/prettier-plugin-([a-z0-9-]+)/);
    if (match) {
      const extension = match[1];
      const patterns = FILE_PATTERN_MAPPINGS[extension];
      return patterns;
    }
  }

  return undefined;
};

const getParserName = (
  filePatterns: string[] | undefined,
): string | undefined => {
  if (!filePatterns) return undefined;

  for (const pattern of filePatterns) {
    // Extract extension from *.ext pattern
    const match = pattern.match(/\*\.([a-z0-9-]+)/);
    if (match) {
      const extension = match[1];
      const parser = PARSER_MAPPINGS[extension];
      if (parser) {
        return parser;
      }
    }
  }

  return undefined;
};

const getCondition = (name: string): PluginCondition => {
  const lowerName = name.toLowerCase();

  // Core plugins should always be active
  if (
    [
      "@prettier/plugin-oxc",
      "prettier-plugin-multiline-arrays",
      "prettier-plugin-ignored",
      "prettier-plugin-organize-imports",
      "prettier-plugin-organize-attributes",
    ].some(plugin => lowerName.includes(plugin))
  ) {
    return "always";
  }

  // Organization plugins typically work globally
  if (["organize", "sort"].some(keyword => lowerName.includes(keyword))) {
    return "always";
  }

  // Skip deprecated or experimental plugins
  if (
    ["deprecated", "experimental", "unstable"].some(keyword =>
      lowerName.includes(keyword),
    )
  ) {
    return "never";
  }

  // Language and framework plugins are file-specific
  return "git-tracked";
};

const generatePluginTemplate = (pkg: NpmPackage): PluginDefinition | null => {
  const filePatterns = detectFilePatterns(pkg.name, pkg.keywords);
  const parser = getParserName(filePatterns);
  const condition = getCondition(pkg.name);

  const template: PluginDefinition = {
    condition,
    description: pkg.description ?? `${pkg.name} formatter`,
  };

  // Add file patterns if detected
  if (filePatterns) {
    template.filePatterns = filePatterns;
  }

  // Add overrides if we have parser information
  if (parser && filePatterns) {
    template.overrides = [
      {
        files: filePatterns,
        options: { parser },
      },
    ];
  }

  // Add common options for specific file types
  if (filePatterns) {
    const options: Record<string, unknown> = {};

    if (filePatterns.some(p => p.includes("yaml") || p.includes("yml"))) {
      options.singleQuote = false;
    }

    if (filePatterns.some(p => p.includes("css"))) {
      options.singleQuote = false;
    }

    if (filePatterns.some(p => p.includes("md"))) {
      options.printWidth = 80;
      options.proseWrap = "always";
    }

    if (Object.keys(options).length > 0) {
      if (template.overrides) {
        template.overrides[0].options = {
          ...template.overrides[0].options,
          ...options,
        };
      } else {
        template.overrides = [
          {
            files: filePatterns,
            options,
          },
        ];
      }
    }
  }

  return template;
};

const searchForPrettierPlugins = async (
  options: SearchOptions = {},
): Promise<NpmPackage[]> => {
  const { limit = 1000 } = options;

  consola.info("Searching for prettier plugins...");

  const searchQueries = ["prettier-plugin", "@prettier/plugin"];

  const allPackages: NpmPackage[] = [];
  const seenNames = new Set<string>();

  for (const query of searchQueries) {
    try {
      consola.info(`Searching for: ${query}`);

      const results = await new Promise<NpmPackage[]>((resolve, reject) => {
        const packages: NpmPackage[] = [];
        const stream = libnpmsearch.stream(query, {
          limit,
          sortBy: "popularity",
        });

        stream.on("data", (pkg: NpmPackage) => packages.push(pkg));
        stream.on("end", () => {
          resolve(packages);
        });
        stream.on("error", reject);
      });

      for (const pkg of results) {
        // Filter for actual prettier plugins
        const isPrettierPlugin =
          pkg.name.includes("prettier-plugin") ||
          pkg.name.includes("@prettier/plugin") ||
          pkg.keywords?.some(k => k.toLowerCase().includes("prettier"));

        if (isPrettierPlugin && !seenNames.has(pkg.name)) {
          seenNames.add(pkg.name);
          allPackages.push(pkg);
        }
      }
    } catch (error) {
      consola.warn(`Failed to search for '${query}':`, error);
    }
  }

  // Sort by popularity (name-based heuristic for now)
  allPackages.sort((a, b) => a.name.localeCompare(b.name));

  consola.success(`Found ${allPackages.length} prettier plugins`);
  return allPackages;
};

const loadExistingPlugins = async (): Promise<PluginDefinitions> => {
  try {
    const pluginsPath = join(__dirname, "../schema/prettier-plugins.json");
    const content = await readFile(pluginsPath, "utf-8");
    const plugins = JSON.parse(content) as PluginDefinitions & {
      $schema?: string;
    };

    // Remove $schema field if present

    const { $schema: _schema, ...pluginDefinitions } = plugins;
    return pluginDefinitions as PluginDefinitions;
  } catch (error) {
    consola.warn("Could not load existing plugins:", error);
    return {};
  }
};

const mergePluginTemplates = async (
  existing: PluginDefinitions,
  newTemplates: Record<string, PluginDefinition>,
): Promise<{
  merged: PluginDefinitions;
  added: string[];
  skipped: string[];
}> => {
  const merged = { ...existing };
  const added: string[] = [];
  const skipped: string[] = [];

  for (const [name, template] of Object.entries(newTemplates)) {
    if (existing[name as keyof PluginDefinitions]) {
      skipped.push(name);
      consola.info(`Skipping existing plugin: ${name}`);
    } else {
      (merged as Record<string, PluginDefinition>)[name] = template;
      added.push(name);
      consola.success(`Adding new plugin: ${name}`);
    }
  }

  return { merged, added, skipped };
};

const writePluginsFile = async (plugins: PluginDefinitions): Promise<void> => {
  const pluginsPath = join(__dirname, "../schema/prettier-plugins.json");

  const content: Record<string, unknown> = {
    $schema: "./prettier-plugins.schema.json",
    ...plugins,
  };

  // Create backup
  try {
    const existingContent = await readFile(pluginsPath, "utf-8");
    const backupPath = pluginsPath + ".backup";
    await writeFile(backupPath, existingContent);
    consola.info(`Created backup: ${backupPath}`);
  } catch {
    // File might not exist yet, that's okay
  }

  await writeFile(pluginsPath, JSON.stringify(content, null, 2) + "\n");
  consola.success(`Updated plugins file: ${pluginsPath}`);
};

const main = async (): Promise<void> => {
  const args = process.argv.slice(2);
  const options: SearchOptions = {
    interactive: args.includes("--interactive"),
    limit: 1000,
  };

  consola.info("🔍 Prettier Plugin Discovery Tool");

  try {
    // Search for plugins
    const packages = await searchForPrettierPlugins(options);

    if (packages.length === 0) {
      consola.warn("No prettier plugins found");
      return;
    }

    // Generate templates
    const newTemplates: Record<string, PluginDefinition> = {};

    for (const pkg of packages) {
      const template = generatePluginTemplate(pkg);
      if (template) {
        newTemplates[pkg.name] = template;
      }
    }

    consola.info(
      `Generated ${Object.keys(newTemplates).length} plugin templates`,
    );

    // Load existing plugins
    const existing = await loadExistingPlugins();
    consola.info(`Loaded ${Object.keys(existing).length} existing plugins`);

    // Merge templates
    const { merged, added, skipped } = await mergePluginTemplates(
      existing,
      newTemplates,
    );

    // Write results
    if (added.length > 0) {
      consola.success(`\n📊 Summary:`);
      consola.success(`  Added: ${added.length} new plugins`);
      consola.success(`  Skipped: ${skipped.length} existing plugins`);
      consola.success(`  Total: ${Object.keys(merged).length} plugins`);

      if (options.interactive) {
        consola.info("\n🔍 New plugins to be added:");
        added.forEach(name => {
          consola.info(`  - ${name}`);
        });

        // In a real implementation, you'd add interactive prompts here
        consola.info("Interactive mode not fully implemented - proceeding...");
      }

      await writePluginsFile(merged);
    } else {
      consola.info("No new plugins to add");
    }
  } catch (error) {
    consola.error("Error:", error);
    process.exit(1);
  }
};

if (require.main === module) {
  main();
}
