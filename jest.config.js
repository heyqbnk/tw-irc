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
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
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
