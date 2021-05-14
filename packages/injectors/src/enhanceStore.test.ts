import { identity } from 'ramda';
import { createStore } from 'redux';

import { DEFAULT_FEATURE } from '@redux-syringe/namespaces';
import { noop } from '@redux-syringe/utils';

import { enhanceStore } from './enhanceStore';
import { makeStoreInterface } from './makeStoreInterface';

const baseStore = createStore(identity);

describe('enhanceStore', () => {
	const storeInterface = makeStoreInterface<typeof noop, 'noops'>('noops');

	it('sets entries based on type', () => {
		const store = enhanceStore(baseStore, storeInterface);
		expect(store.entries?.noops).toEqual([]);
	});

	it('spreads passed store to new store', () => {
		const store = enhanceStore(baseStore, storeInterface);
		expect(store.dispatch).toBe(baseStore.dispatch);
		expect(store.getState).toBe(baseStore.getState);
	});

	it('sets injection methods based on type', () => {
		const store = enhanceStore(baseStore, storeInterface);
		expect(store.injectNoops).toBeInstanceOf(Function);
		expect(store.ejectNoops).toBeInstanceOf(Function);
	});

	it('updates entries on injection', () => {
		const store = enhanceStore(baseStore, storeInterface);
		store.injectNoops({ foo: noop }, { namespace: 'bar' });
		expect(store.entries?.noops).toEqual([
			{ path: ['foo'], value: noop, namespace: 'bar', feature: DEFAULT_FEATURE },
		]);

		store.ejectNoops({ foo: noop }, { namespace: 'bar' });
		expect(store.entries?.noops).toEqual([]);
	});

	it('dispatches actions on injection', () => {
		const dispatch = jest.fn();
		const store = enhanceStore({ ...baseStore, dispatch }, storeInterface);
		store.injectNoops({ foo: noop }, { namespace: 'bar' });
		expect(dispatch).toHaveBeenCalledTimes(1);
		const injectedAction = dispatch.mock.calls[0][0];
		expect(injectedAction.type).toBe('@redux-syringe/NOOPS_INJECTED');
		expect(injectedAction.payload).toEqual([['foo']]);
		expect(injectedAction.meta).toEqual({ namespace: 'bar' });
		jest.clearAllMocks();
		store.ejectNoops({ foo: noop }, { namespace: 'bar' });
		expect(dispatch).toHaveBeenCalledTimes(1);
		const ejectedAction = dispatch.mock.calls[0][0];
		expect(ejectedAction.type).toBe('@redux-syringe/NOOPS_EJECTED');
		expect(ejectedAction.payload).toEqual([['foo']]);
		expect(ejectedAction.meta).toEqual({ namespace: 'bar' });
	});

	it('calls handlers on ejection', () => {
		const onInjected = jest.fn();
		const onEjected = jest.fn();
		const store = enhanceStore(baseStore, storeInterface, { onInjected, onEjected });
		store.injectNoops({ foo: noop }, { namespace: 'bar' });
		expect(onInjected).toHaveBeenCalledTimes(1);
		expect(onEjected).not.toHaveBeenCalled();
		jest.clearAllMocks();
		store.ejectNoops({ foo: noop }, { namespace: 'bar' });
		expect(onEjected).toHaveBeenCalledTimes(1);
		expect(onInjected).not.toHaveBeenCalled();
	});
});
