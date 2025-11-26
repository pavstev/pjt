export const printHelp = (): void => {
  console.log("pjt [command]");
  console.log("");
  console.log("Commands:");
  console.log(
    "  package-json-tools  Clean git repository by removing untracked files",
  );
  console.log(
    "  ai-commit          Generate AI commit message, commit, and push with force",
  );
  console.log("");
  console.log("Options:");
  console.log("  -v, --version  output the version number");
  console.log("  -h, --help     display help for command");
};
