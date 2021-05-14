import { attachNamespace } from './attachNamespace';

const action = { type: 'action' };

describe('attachNamespace', () => {
	it('adds a namespace to an action', () => {
		expect(attachNamespace('yo', action)).toEqual({
			...action,
			meta: { namespace: 'yo' },
		});
	});

	it('returns the original action when no namespace is passed', () => {
		// @ts-expect-error `null` should be allowed as a valid namespace.
		expect(attachNamespace(null, action)).toBe(action);
		// @ts-expect-error `null` should be allowed as a valid namespace.
		expect(attachNamespace(undefined, action)).toBe(action);
	});

	it('adds a namespace to a function', () => {
		const thunk = () => 'YOLO';
		const wrappedThunk = attachNamespace('yo', thunk);
		expect(wrappedThunk.meta.namespace).toBe('yo');
		expect(wrappedThunk()).toBe('YOLO');
	});

	it('overwrites existing namespace', () => {
		expect(
			attachNamespace('hi', {
				...action,
				meta: { namespace: 'yo' },
			})
		).toEqual({
			...action,
			meta: { namespace: 'hi' },
		});
	});
});
