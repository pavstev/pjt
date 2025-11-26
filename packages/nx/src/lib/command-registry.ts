import { readdir } from "node:fs/promises";
import { join } from "node:path";

const commands = new Map<string, Record<string, unknown>>();

/**
 * Registers a command with validation
 * @param name - Command name (must be kebab-case, no duplicates)
 * @param command - Citty command definition
 */
export const registerCommand = (
  name: string,
  command: Record<string, unknown>,
): void => {
  if (commands.has(name)) {
    throw new Error(`Command "${name}" is already registered`);
  }

  if (!/^[a-z][a-z0-9-]*$/.test(name)) {
    throw new Error(
      `Command name "${name}" must be kebab-case (lowercase, numbers, hyphens only)`,
    );
  }

  commands.set(name, command);
};

/**
 * Auto-discovers and registers commands from the commands directory
 */
export const autoDiscoverCommands = async (): Promise<void> => {
  const commandsDir = join(__dirname, "../commands");

  try {
    const files = await readdir(commandsDir);
    const commandFiles = files.filter(
      file => file.endsWith(".ts") && !file.startsWith("."),
    );

    for (const file of commandFiles) {
      const commandName = file.replace(".ts", "");
      try {
        // Dynamic import to register the command
        await import(join(commandsDir, file));
      } catch (error) {
        console.warn(`Failed to load command ${commandName}:`, error);
      }
    }
  } catch (error) {
    console.warn("Failed to auto-discover commands:", error);
  }
};

/**
 * Gets all registered commands as subcommand object
 */
export const getCommands = (): Record<string, Record<string, unknown>> => {
  return Object.fromEntries(commands);
};

/**
 * Gets command names for validation
 */
export const getCommandNames = (): string[] => {
  return Array.from(commands.keys());
};
