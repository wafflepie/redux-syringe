import { NAMESPACE_PREVENTED } from './constants';
import { preventNamespace } from './preventNamespace';

describe('preventNamespace', () => {
	it('overwrites namespace of actions', () => {
		expect(
			preventNamespace({
				type: 'action',
				meta: { namespace: 'foo' },
			})
		).toEqual({
			type: 'action',
			meta: { namespace: NAMESPACE_PREVENTED },
		});
	});
});
