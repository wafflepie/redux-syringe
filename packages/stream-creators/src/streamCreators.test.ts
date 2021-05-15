import { StateObservable } from 'redux-observable';
import { ReplaySubject, Subject } from 'rxjs';

import { getStateByFeatureAndNamespace, Feature, Namespace } from '@redux-syringe/namespaces';

import { globalAction$, namespacedState$ } from './streamCreators';

jest.mock('@redux-syringe/namespaces');

(getStateByFeatureAndNamespace as any).mockImplementation(
	(feature: Feature, namespace: Namespace) => (state: string) => `${feature}-${namespace}/${state}`
);

const initialState = 'state';
const stateReplaySubject = new ReplaySubject<string>();
stateReplaySubject.next(initialState);

const streamCreatorApi = {
	state$: new StateObservable(stateReplaySubject, initialState),
	namespace: 'ns',
	feature: 'f',
	path: ['f', 'ns'],
	action$: new Subject(),
	globalAction$: new Subject(),
};

describe('namespacedState$', () => {
	it('returns a namespaced state stream', () => {
		const result: StateObservable<string> = namespacedState$(streamCreatorApi);

		result.subscribe(namespacedState => {
			expect(namespacedState).toEqual('f-ns/state');
		});
	});
});

describe('globalAction$', () => {
	it('returns the global action stream', () => {
		expect(globalAction$(streamCreatorApi)).toBe(streamCreatorApi.globalAction$);
	});
});
