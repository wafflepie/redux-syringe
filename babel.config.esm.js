const babelConfig = require('./babel.config');

module.exports = {
	...babelConfig,
	plugins: babelConfig.plugins.map(entry =>
		entry === '@babel/transform-runtime'
			? ['@babel/transform-runtime', { useESModules: true }]
			: entry
	),
};
