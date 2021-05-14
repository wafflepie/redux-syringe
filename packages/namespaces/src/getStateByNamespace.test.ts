import { DEFAULT_FEATURE } from './constants';
import { getStateByNamespace } from './getStateByNamespace';

const state = {
	[DEFAULT_FEATURE]: {
		foo: { value: 'Wassup' },
	},
};

describe('getStateByNamespace', () => {
	it('retrieves correct state slice an existing namespace is passed', () => {
		expect(getStateByNamespace('foo', state)).toBe(state[DEFAULT_FEATURE].foo);
	});

	it('returns undefined when a nonexistent namespace is passed', () => {
		expect(getStateByNamespace('bar', state)).toBeUndefined();
	});

	it('returns undefined when no namespace is passed', () => {
		// @ts-expect-error `undefined` shouldn't be allowed as a valid namespace.
		expect(getStateByNamespace(undefined, state)).toBeUndefined();
	});
});
