module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./jest.setup.js"],
  workerThreads: true, // to handle bigint
  modulePathIgnorePatterns: [".yalc", "dist"],
  collectCoverageFrom: [
    "./src/hooks/*.ts",
    "!**/node_modules/**",
    "!./src/__utils/**",
    "!./src/index.ts",
    "!./src/types.ts",
    "!.yalc",
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
