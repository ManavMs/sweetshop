module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/*.test.ts'],
    setupFiles: ['dotenv/config'],
    clearMocks: true,
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};
