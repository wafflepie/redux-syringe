import { alwaysNull } from './alwaysNull';

describe('alwaysNull', () => {
	it('returns null', () => {
		expect(alwaysNull()).toBe(null);
	});
});
