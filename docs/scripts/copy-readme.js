const fs = require("fs");
const path = require("path");

const readmePath = path.join(__dirname, "../../README.md");
const outputPath = path.join(__dirname, "../content/docs/index.mdx");

const readmeContent = fs.readFileSync(readmePath, "utf8");

const frontmatter = `---
title: pjt
---

`;

const mdxContent = frontmatter + readmeContent;

fs.writeFileSync(outputPath, mdxContent, "utf8");

console.log("README copied to docs content");
