import { capitalize } from './capitalize';

describe('capitalize', () => {
	it('capitalizes the first letter of a string', () => {
		expect(capitalize('foo')).toBe('Foo');
	});

	it('preserves the first letter of a string if already capitalized', () => {
		expect(capitalize('Foo')).toBe('Foo');
	});

	it('does not modify an empty string', () => {
		expect(capitalize('')).toBe('');
	});
});
