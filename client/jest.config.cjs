// jest.config.cjs
module.exports = {
  testEnvironment: 'jsdom', // needed for React + DOM APIs

  // Make sure our setup file (where you import '@testing-library/jest-dom')
  // runs before every test file.
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.js'],

  moduleFileExtensions: ['js', 'jsx'],

  // Tell Jest to use babel-jest for JS/JSX files
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },

  // Optional but nice: ignore built files, coverage, etc.
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/coverage/'],
};
