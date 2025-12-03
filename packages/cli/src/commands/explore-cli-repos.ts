import { Octokit } from "@octokit/rest";
import chalk from "chalk";
import { defineCommand } from "citty";
import Table from "cli-table3";
import { z } from "zod";

import { error } from "../lib/logger";

const RepoSchema = z.object({
  description: z
    .string()
    .nullable()
    .transform((desc: null | string) => desc ?? chalk.dim("No description 📝")),
  forks_count: z.number().int().nonnegative(),
  html_url: z.url(),
  id: z.number().int(),
  name: z.string(),
  stargazers_count: z.number().int().nonnegative(),
});

const SearchResponseSchema = z.object({
  items: z.array(RepoSchema),
  total_count: z.number().int().nonnegative(),
});

type Repository = z.infer<typeof RepoSchema>;

// --- Core Logic Functions ---

const fetchOpenSourceRepos = async (token?: string): Promise<Repository[]> => {
  const octokit = new Octokit({ auth: token });

  try {
    const response = await octokit.request("GET /search/repositories", {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
      order: "desc",
      per_page: 10,
      q: "topic:cli language:typescript stars:>=1000",
      sort: "stars",
    });

    const validationResult = SearchResponseSchema.safeParse(response.data);

    if (!validationResult.success) {
      error("Zod validation failed on GitHub API response structure.");
      error(JSON.stringify(validationResult.error.issues, null, 2));
      throw new Error("Invalid data structure received from GitHub API.");
    }

    return validationResult.data.items as Repository[];
  } catch (e) {
    if (e instanceof Error) {
      error(`API Call failed: ${e.message}`);
    } else {
      error("An unknown Octokit error occurred.");
    }

    // Re-throw to be caught by the main execution block's .catch()
    throw e;
  }
};

const formatReposForCli = (repos: Repository[]): string => {
  if (repos.length === 0) {
    return "No 📂 repositories found matching the search criteria.";
  }

  const table = new Table({
    head: [
      chalk.white.bold("No."),
      chalk.yellow.bold("🏷️ Repository Name"),
      chalk.blue.bold("📝 Description"),
      chalk.green.bold("🔗 Link"),
      chalk.magenta.bold("⭐ Stars"),
      chalk.magenta.bold("🔀 Forks"),
      chalk.dim("🔑 ID"),
    ],
    style: {
      border: ["gray"],
      head: ["bold"],
    },
  });

  for (const [index, repo] of repos.entries()) {
    table.push([
      (index + 1).toString(),
      chalk.yellow.bold(repo.name),
      repo.description,
      chalk.blue.underline(repo.html_url.replace("https://github.com/", "")),
      chalk.bgMagenta.white.bold(` ${repo.stargazers_count.toLocaleString()} `),
      chalk.dim(repo.forks_count.toLocaleString()),
      chalk.dim(repo.id.toString()),
    ]);
  }

  const title = chalk.white.bgBlue.bold(
    "\n 🚀 Top 10 TypeScript CLI Open Source Explorers 💻 (Sort: ⭐) \n",
  );

  return title + table.toString();
};

export const command = defineCommand({
  meta: {
    description: "Explore top TypeScript CLI repositories on GitHub",
    name: "explore-cli-repos",
  },
  run: async () => {
    const token = process.env.GITHUB_TOKEN; // Optional GitHub token from env
    const repos = await fetchOpenSourceRepos(token);
    const output = formatReposForCli(repos);
    console.log(output);
  },
});
