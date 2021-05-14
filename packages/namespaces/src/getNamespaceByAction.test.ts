import { getNamespaceByAction } from './getNamespaceByAction';

describe('getNamespaceByAction', () => {
	it('returns the namespace of an action', () => {
		expect(
			getNamespaceByAction({
				type: 'action',
				meta: {
					namespace: 'foo',
				},
			})
		).toBe('foo');
	});

	it('returns undefined if action does not have meta', () => {
		expect(getNamespaceByAction({ type: 'action' })).toBeUndefined();
	});
});
