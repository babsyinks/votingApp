/** @type {import('jest').Config} */
module.exports = {
  rootDir: ".",
  testEnvironment: "node",
  coverageProvider: "v8",
  transform: {
    "^.+\\.[tj]s$": "babel-jest",
  },
  moduleFileExtensions: ["ts", "js", "json"],
  testMatch: ["<rootDir>/__tests__/**/*.test.ts", "<rootDir>/__tests__/**/*.spec.ts"],
  collectCoverageFrom: [
    "**/*.ts",
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/coverage/**",
    "!models/index.ts",
    "!migrations/**",
  ],
};
