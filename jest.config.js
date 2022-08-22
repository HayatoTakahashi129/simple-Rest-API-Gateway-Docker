/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  testMatch: ["**/*+(spec|test).+(ts|tsx|js)"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
