const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

// Any custom config you want to pass to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^.+\\.(css|sass|scss)$": "identity-obj-proxy",

    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

module.exports = createJestConfig(customJestConfig);
