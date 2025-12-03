import { defineCommand } from "citty";
import { promises as fs } from "node:fs";
import { join } from "node:path";
import os from "os";

import { execCommand, execCommandOutput } from "../lib/command";

export const command = defineCommand({
  args: {
    commonName: {
      default: "merged-config.json",
      description: "Output file name",
      required: false,
      type: "positional",
    },
    searchTerm: {
      description: "Search term for config files",
      required: true,
      type: "positional",
    },
  },
  meta: {
    description: "Merge configuration files matching a search term",
    name: "merge-configs",
  },
  run: async ({ args }) => {
    const { searchTerm } = args;
    const { commonName } = args;

    const workDir = join(os.homedir(), "work");
    const tempDir = join(workDir, "gomila");
    const outputPath = join(tempDir, commonName);
    await fs.mkdir(tempDir, { recursive: true });

    console.log(
      `🔍 Searching for files matching '${searchTerm}' in ${workDir}...`,
    );

    // Find matching files using fd (fdfind)
    const findCommand = `fdfind -H -t f "${searchTerm}" "${workDir}" --exclude dist --exclude node_modules --exclude .astro --exclude .svelte --exclude "*schema.json"`;
    const filesOutput = await execCommandOutput("sh", ["-c", findCommand]);
    const files = filesOutput.trim().split("\n").filter(Boolean);

    if (files.length === 0) {
      console.log(`⚠️  No files found matching '${searchTerm}'.`);
      return;
    }

    console.log(`📦 Found ${files.length} files.`);

    // Copy files with kebab-case paths
    for (const f of files) {
      const relPath = f.replace(`${workDir}/`, "");
      const kebabPath = relPath.replace(/[/A-Z]/g, match =>
        match === "/" ? "-" : match.toLowerCase(),
      );
      const dest = join(tempDir, `temp-${searchTerm}-${kebabPath}`);
      await fs.mkdir(join(dest, ".."), { recursive: true });
      await fs.copyFile(f, dest);
      console.log(`📄 Copied: ${relPath} → ${kebabPath}`);
    }

    // Run opencode
    console.log("🧠 Running opencode build agent...");

    const prompt = `
You are a senior software engineer specializing in configuration and codebase harmonization.

Your task:
1. Carefully analyze all files in ~/work/gomila that start with 'temp-${searchTerm}-'.
2. Determine what these files represent (e.g., configs, settings, feature flags, etc.).
3. Identify overlapping keys, repeated structures, and conflicting definitions.
4. Unify and merge them into a single, clean, production-ready configuration file named '${commonName}'.

Output requirements:
- The file must be well-organized, logically grouped, and self-documenting.
- Maintain consistent structure, naming, indentation, and ordering.
- Merge duplicated or related keys under one unified section.
- Preserve and merge all unique data, removing redundancy.
- If similar structures differ slightly, merge intelligently and include comments if necessary.
- Add minimal, helpful inline comments where reasoning is non-obvious.

Formatting:
- Use the correct syntax for the detected file type (JSON, YAML, JS, etc.).
- Consistent indentation and spacing.
- No extra commentary outside the code block.

Deliverable:
Output only the final merged '${commonName}' file contents.
`;

    const opencodeCommand = `opencode run "${prompt}" --agent "build"`;
    await execCommand("sh", ["-c", `${opencodeCommand} | tee "${outputPath}"`]);

    // Cleanup
    console.log("🧹 Removing temporary files...");
    await execCommand("find", [
      tempDir,
      "-type",
      "f",
      "-name",
      `temp-${searchTerm}-*`,
      "-delete",
    ]);

    console.log(`✅ Successfully merged into: ${outputPath}`);
    console.log("🗂️ All temporary files have been removed safely.");
  },
});
