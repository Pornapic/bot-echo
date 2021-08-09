import type { Config } from "@jest/types";

// Sync object
const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: [
    "**/__tests__/*.test.ts",
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.ts",
  ],
  coveragePathIgnorePatterns: [
    "src/index.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
export default config;
