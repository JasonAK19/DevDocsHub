module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    },
    transform: {
      '^.+\\.(ts|tsx)$': ['ts-jest', {
        tsconfig: './tsconfig.jest.json',
        useESM: true
      }]
    },
    testMatch: [
      '**/__tests__/**/*.+(ts|tsx|js)',
      '**/?(*.)+(spec|test).+(ts|tsx|js)'
    ],
    coveragePathIgnorePatterns: [
      '/node_modules/',
      '/.next/',
      '/coverage/'
    ]
};