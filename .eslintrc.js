module.exports = {
	root: true,
	extends: ['airbnb', 'prettier'],
	env: {
		jest: true,
	},
	parser: '@babel/eslint-parser',
	plugins: ['react-hooks'],
	rules: {
		'padding-line-between-statements': [
			'error',
			{
				blankLine: 'always',
				prev: ['block', 'block-like', 'export', 'import', 'multiline-expression'],
				next: '*',
			},
			{
				blankLine: 'always',
				prev: '*',
				next: ['block', 'block-like', 'export', 'import', 'return', 'throw'],
			},
			{
				blankLine: 'any',
				prev: ['export', 'import'],
				next: ['export', 'import'],
			},
			{
				blankLine: 'never',
				prev: 'case',
				next: '*',
			},
		],
		// NOTE: Sadly, `sort-imports` is not really compatible with `import/order`.
		'import/order': [
			'error',
			{
				'newlines-between': 'always',
				pathGroups: [
					{
						pattern: '@redux-syringe/**',
						group: 'external',
						position: 'after',
					},
				],
				pathGroupsExcludedImportTypes: ['builtin'],
				alphabetize: {
					order: 'asc',
					caseInsensitive: false,
				},
			},
		],
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'warn',
		'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
		'import/no-extraneous-dependencies': [
			'error',
			{ devDependencies: ['packages/**/*.test.js', '*.js'] },
		],
		// TODO: Look at `common-tags` to solve indentation issues with multiline template strings.
		'prefer-template': 'off',
		'import/prefer-default-export': 'off',
		'react/jsx-filename-extension': ['error', { extensions: ['.js'] }],
		'react/jsx-props-no-spreading': 'off',
		'react/require-default-props': 'off',
	},
};
