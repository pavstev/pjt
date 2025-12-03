export const config = {
  executors: {
    "pnpm:exec-workspace-script": {
      command: ["pnpm", "-s", "exec", "@StringJoin($options.command, ' ')"],
      cwd: "$workspace.root",
      options: {
        type: "object",
        properties: {
          cwd: {
            type: "string",
            format: "path",
            description: "The working directory for the command execution.",
          },
          command: {
            type: "array",
            description:
              "The command to run in the workspace root using pnpm exec.",
            minLength: 1,
            items: {
              type: "string",
            },
          },
        },
        required: ["command", "cwd"],
      },
    },
    "pnpm:exec-project-script": {
      command: [
        "pnpm",
        "-s",
        "-C $project.root",
        "exec",
        "$options.scriptName",
      ],
      cwd: "$workspace.root",
      options: {
        type: "object",
        properties: {
          parallel: {
            type: "integer",
            description: "The number of parallel processes to run.",
            minimum: 1,
            maximum: 32,
            default: 3,
          },
          cwd: {
            type: "string",
            format: "path",
            description: "The working directory for the command execution.",
          },
          scriptName: {
            type: "string",
            description:
              "The name of the script to run in the project. It must be defined in the project's package.json.",
          },
        },
        required: ["scriptName", "cwd"],
      },
    },
  },
  targets: {
    format: {
      executor: "pnpm:exec-workspace-script",
      options: {
        command: [
          "prettier",
          "--cache --cache-strategy=content",
          "--log-level=silent",
          "--write",
          ".",
        ],
      },
    },
    lint: {
      executor: "pnpm:exec-workspace-script",
      options: {
        command: [
          "eslint",
          "--cache --cache-strategy=content",
          "--config=eslint.config.ts",
          "--fix",
          ".",
        ],
      },
    },
    build: {
      executor: "pnpm:exec-project-script",
      options: {
        cwd: "$project.root",
        scriptName: "build",
      },
    },
    test: {
      executor: "pnpm:exec-project-script",
      options: {
        cwd: "$project.root",
        scriptName: "test",
      },
    },
  },
};

export default config;
