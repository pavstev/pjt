import { defineCommand } from "citty";

import { createLogger } from "../lib/logger";
import { partialCloneUrl } from "../lib/partial-clone";

export const command = defineCommand({
  args: {
    dest: {
      description: "Destination path",
      required: true,
      type: "positional",
    },
    url: {
      description: "GitHub URL",
      required: true,
      type: "positional",
    },
  },
  meta: {
    description: "Partially clones a repo.",
    name: "partial-clone",
  },
  run: async ({ args }) => {
    const logger = createLogger();
    await partialCloneUrl(args.url, args.dest, logger);
  },
});
