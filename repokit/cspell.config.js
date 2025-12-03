/**
 * @type {import("@cspell/eslint-plugin").CSpellOptions}
 * @see https://github.com/streetsidesoftware/cspell/blob/main/cspell.schema.json
 */
export default {
  $schema:
    "https://raw.githubusercontent.com/streetsidesoftware/cspell/main/cspell.schema.json",
  language: "en",
  dictionaries: [
    "softwareTerms",
    "typescript",
    "node",
    "html",
    "npm",
    "filetypes",
    "bash",
    "remarkrc",
    "projectDictionary",
  ],
  dictionaryDefinitions: [
    {
      addWords: true,
      description: "Project-specific dictionary for custom words",
      name: "projectDictionary",
      noSuggest: false,
      path: "./config/project.dictionary.txt",
    },
  ],
  files: ["**/*"],
  cache: {
    cacheFormat: "universal",
    cacheStrategy: "metadata",
    useCache: true,
    cacheLocation: "node_modules/.cache/cspell",
  },
  ignorePaths: [
    "*.code-workspace",
    "**/*.{mdx,md}",
    "pnpm-lock.yaml",
    "node_modules/**",
    "dist/**",
    "build/**",
    ".git/**",
    "*.min.js",
    "*.min.css",
    "**/.config/**",
  ],
  languageSettings: [
    {
      dictionaries: ["typescript", "node"],
      languageId: "typescript,javascript",
    },
    {
      dictionaries: ["css"],
      languageId: "css,scss,less",
    },
    {
      dictionaries: ["html"],
      languageId: "html",
    },
  ],
  words: [],
  useGitignore: true,
  caseSensitive: false,
  allowCompoundWords: false,
};
