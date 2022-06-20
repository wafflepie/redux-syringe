module.exports = {
	root: true,
	extends: [
		'airbnb',
		'plugin:@typescript-eslint/recommended',
		'plugin:import/typescript',
		'prettier',
	],
	env: {
		browser: true,
		commonjs: true,
		es6: true,
		jest: true,
		node: true,
	},
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.tsx', '.ts', '.js'],
			},
		},
		'import/extensions': ['.tsx', '.ts', '.js'],
	},
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'react-hooks'],
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
			{ devDependencies: ['packages/**/*.test.{js,ts,tsx}', '*.js'] },
		],
		// TODO: Look at `common-tags` to solve indentation issues with multiline template strings.
		'prefer-template': 'off',
		'import/prefer-default-export': 'off',
		'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.js'] }],
		'react/jsx-props-no-spreading': 'off',
		'react/require-default-props': 'off',
		'no-use-before-define': 'off',
		'import/extensions': [
			'error',
			'ignorePackages',
			{
				tsx: 'never',
				ts: 'never',
				js: 'never',
			},
		],
		'no-restricted-imports': [
			'error',
			{
				patterns: ['@redux-syringe/*/src', '@redux-syringe/*/src/**'],
			},
		],
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'react/function-component-definition': 'off',
		'default-param-last': 'off',
		'@typescript-eslint/no-unnecessary-type-constraint': 'off',
	},
};
