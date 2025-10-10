module.exports = {
  collectCoverage: true,
  moduleFileExtensions: ["js", "mjs", "ts", "tsx", "json"],
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest"
  },
  testRegex: ".*\\.test\\.[tj]sx?$",
  testPathIgnorePatterns: [
    "/node_modules/",
    "/__tests__/testData/",
    "/__tests__/components/types/"
  ]
};
