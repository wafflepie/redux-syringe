import { getDisplayName } from './getDisplayName';

const DisplayNameComponent = () => null;

DisplayNameComponent.displayName = 'Hello';

const NameComponent = () => null;

describe('getDisplayName', () => {
	it('returns the most appropriate display name', () => {
		expect(getDisplayName(DisplayNameComponent)).toBe(DisplayNameComponent.displayName);
		expect(getDisplayName(NameComponent)).toBe(NameComponent.name);
		expect(getDisplayName('div')).toBe('div');
		expect(getDisplayName(() => null)).toBe('Component');
	});
});
