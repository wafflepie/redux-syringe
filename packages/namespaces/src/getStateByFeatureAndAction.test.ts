import { getStateByFeatureAndAction } from './getStateByFeatureAndAction';

const state = {
	someFeature: {
		foo: { value: 'Wassup' },
	},
};

const fooAction = {
	type: 'action',
	meta: { namespace: 'foo' },
};

describe('getStateByFeatureAndAction', () => {
	it('retrieves correct state slice when an existing namespace is passed', () => {
		expect(getStateByFeatureAndAction('someFeature', fooAction, state)).toBe(state.someFeature.foo);
		expect(getStateByFeatureAndAction('someFeature')(fooAction, state)).toBe(state.someFeature.foo);
		expect(getStateByFeatureAndAction('someFeature', fooAction)(state)).toBe(state.someFeature.foo);
		expect(getStateByFeatureAndAction('someFeature')(fooAction)(state)).toBe(state.someFeature.foo);
	});

	it('returns undefined when a nonexistent namespace is passed', () => {
		expect(
			getStateByFeatureAndAction(
				'someFeature',
				{ type: 'action', meta: { namespace: 'bar' } },
				state
			)
		).toBeUndefined();
	});

	it('returns undefined when a nonexistent feature is passed', () => {
		expect(
			getStateByFeatureAndAction(
				'randomFeature',
				{ type: 'action', meta: { namespace: 'foo' } },
				// @ts-expect-error `randomFeature` shouldn't be allowed as an existing feature.
				state
			)
		).toBeUndefined();
	});

	it('returns undefined when no namespace is passed', () => {
		expect(
			getStateByFeatureAndAction(
				'someFeature',
				// @ts-expect-error `undefined` shouldn't be allowed as a valid namespace.
				{ type: 'action', meta: { namespace: undefined } },
				state
			)
		).toBeUndefined();
	});
});
