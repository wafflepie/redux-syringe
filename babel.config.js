module.exports = {
	presets: [
		[
			'@babel/env',
			{
				modules: false,
			},
		],
		'@babel/react',
	],
	plugins: [
		'@babel/transform-runtime',
		process.env.NODE_ENV === 'test' && [
			'@babel/plugin-transform-modules-commonjs',
			{
				loose: true,
			},
		],
	].filter(Boolean),
};
