// ! DO NOT MODIFY
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  overrides: [
    {
      files: ["**/*.spec.js"],
      extends: ["plugin:cypress/recommended"],
    },
  ],
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    project: `${__dirname}/tsconfig.eslint.json`,
  },
  settings: {},
  rules: {
    "no-unused-vars": [0],
    "@typescript-eslint/explicit-function-return-type": [2],
  },
};
