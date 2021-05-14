import { defaultNamespace } from './defaultNamespace';

const action = { type: 'action' };

describe('defaultNamespace', () => {
	it('adds a namespace to an action', () => {
		expect(defaultNamespace('yo', action)).toEqual({
			...action,
			meta: { namespace: 'yo' },
		});
	});

	it('returns the original action when no namespace is passed', () => {
		// @ts-expect-error `null` should be allowed as a valid namespace.
		expect(defaultNamespace(null, action)).toBe(action);
		// @ts-expect-error `null` should be allowed as a valid namespace.
		expect(defaultNamespace(undefined, action)).toBe(action);
	});

	it('adds a namespace to a function', () => {
		const thunk = () => 'YOLO';
		const wrappedThunk = defaultNamespace('yo', thunk);
		expect(wrappedThunk.meta.namespace).toBe('yo');
		expect(wrappedThunk()).toBe('YOLO');
	});

	it('does not overwrite existing namespace', () => {
		expect(
			defaultNamespace('hi', {
				...action,
				meta: { namespace: 'yo' },
			})
		).toEqual({
			...action,
			meta: { namespace: 'yo' },
		});
	});

	it('does not overwrite namespace of a function', () => {
		const thunk = () => 'YOLO';
		thunk.meta = { namespace: 'yo' };
		const wrappedThunk = defaultNamespace('what', thunk);
		expect(wrappedThunk.meta.namespace).toBe('yo');
		expect(wrappedThunk()).toBe('YOLO');
	});
});
