// ./server/jest.config.js
module.exports = {
	displayName: 'server',
	modulePaths: ['<rootDir>/src'],
	testEnvironment: 'node',
	testPathIgnorePatterns: ['<rootDir>/src/resolvers/__tests__/helpers.js'],
	// testRegex: '*.test.js',
	verbose: true,
};
