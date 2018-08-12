module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
    "cypress/globals": true
  },
  plugins: ["cypress"],
  extends: "eslint:recommended",
  parserOptions: {
    sourceType: "module"
  },
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["warn", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"]
  }
};
