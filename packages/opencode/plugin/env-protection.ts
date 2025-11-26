import { type Plugin } from "@opencode-ai/plugin";

const dotenvFile = ".env"

export const EnvProtection: Plugin = async ({
  $,
}) => ({
  "tool.execute.before": async (input, output) => {
    if (input.tool === "read" && output.args.filePath.includes(dotenvFile)) {
      await $`notify-send "Env Protection" "Attempted to read "${dotenvFile}" file: ${output.args.filePath}"`;
      throw new Error(`Do not read "${dotenvFile}" files`);
    }
  },
});
