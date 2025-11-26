export default await import("./src/eslint-config.js").then(m =>
  m.eslintConfig(),
);
