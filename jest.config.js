module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'lib/**/*.ts',
    '!lib/**/index.ts',
    '!lib/**/types.ts',
    '!lib/**/types/**/**.*',
    '!lib/**/(__tests__|__mocks__|__stubs__)/*.{ts,js}',
  ],
  coverageDirectory: './coverage',
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: [
    '<rootDir>/lib/**/__tests__/**/*.test.(ts|js)',
  ],
  verbose: true,
  moduleFileExtensions: ['js', 'ts'],
};
