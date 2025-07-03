export default {
	testEnvironment: 'node',
	transform: {},
	// extensionsToTreatAsEsm: ['.js'],
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1', // Allows imports like ./utils/logger.js to work
	},
};
