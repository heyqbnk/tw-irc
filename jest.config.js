module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'lib/**/*.ts',
    '!lib/**/index.ts',
    '!lib/**/types.ts',
    '!lib/**/types/**/**.*',
    '!lib/**/(__tests__|__mocks__|__stubs__)/*.{ts,js}'
  ],
  coverageDirectory: './coverage',
  // coverageThreshold: {
  //   global: {
  //     branches: 90,
  //     functions: 90,
  //     lines: 90,
  //     statements: 90
  //   }
  // },
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testMatch: [
    '<rootDir>/lib/**/__tests__/**/*.test.(ts|js)'
  ],
  verbose: true,
  moduleFileExtensions: ['js', 'ts'],
};
