const ignorePatterns = ['/node_modules/', '/dist/'];

module.exports = {
	bail: true,
	verbose: true,
	testPathIgnorePatterns: ignorePatterns,
	coveragePathIgnorePatterns: ignorePatterns,
	snapshotSerializers: ['enzyme-to-json/serializer'],
	setupFilesAfterEnv: ['<rootDir>/enzymeSetup.js'],
	testEnvironment: 'jsdom',
};
