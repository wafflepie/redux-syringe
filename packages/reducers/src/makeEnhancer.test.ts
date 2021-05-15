import { identity } from 'ramda';
import { AnyAction, createStore } from 'redux';

import { DEFAULT_FEATURE } from '@redux-syringe/namespaces';

import { storeInterface, makeEnhancer } from './makeEnhancer';

const createMockStore = () => ({
	replaceReducer: jest.fn(),
	dispatch: jest.fn(),
	getState: jest.fn(),
	subscribe: jest.fn(),
	[Symbol.observable]: jest.fn(),
});

const { getEntries } = storeInterface;

describe('makeEnhancer', () => {
	const reducerA = (state = { name: 'a' }) => state;

	const configureStore = () => makeEnhancer()(createMockStore)(identity);

	let store = configureStore();

	beforeEach(() => {
		jest.clearAllMocks();
		store = configureStore();
	});

	it('returns a Redux store with defined functions', () => {
		expect(store.injectReducers).toBeInstanceOf(Function);
		expect(store.ejectReducers).toBeInstanceOf(Function);
	});

	it('handles multiple calls to store.injectReducers', () => {
		store.injectReducers({ foo: identity }, { namespace: 'ns' });
		expect(store.replaceReducer).toHaveBeenCalledTimes(1);
		store.injectReducers({ foo: identity }, { namespace: 'ns' });
		expect(store.replaceReducer).toHaveBeenCalledTimes(2);
	});

	it('handles injecting and ejecting namespaced reducers as functions', () => {
		store.injectReducers(identity, { namespace: 'ns' });

		expect(store.replaceReducer).toHaveBeenCalledTimes(1);
		expect(getEntries(store)).toEqual([
			{ path: [], value: identity, namespace: 'ns', feature: DEFAULT_FEATURE },
		]);

		store.ejectReducers(identity, { namespace: 'ns' });

		expect(store.replaceReducer).toHaveBeenCalledTimes(2);
		expect(getEntries(store)).toEqual([]);
	});

	it('handles injecting and ejecting global reducers as functions', () => {
		store.injectReducers(identity);

		expect(store.replaceReducer).toHaveBeenCalledTimes(1);
		expect(getEntries(store)).toEqual([{ path: [], value: identity }]);

		store.ejectReducers(identity);

		expect(store.replaceReducer).toHaveBeenCalledTimes(2);
		expect(getEntries(store)).toEqual([]);
	});

	it('removes data from state after ejecting (object reducers without preloaded state)', () => {
		store = createStore(identity, makeEnhancer());
		expect(store.getState()).toEqual(undefined);

		store.injectReducers({ a: reducerA });
		expect(store.getState()).toEqual({
			a: { name: 'a' },
		});

		store.ejectReducers({ a: reducerA });
		expect(store.getState()).toEqual({});

		store.injectReducers({ a: reducerA }, { namespace: 'nsA' });
		expect(store.getState()).toEqual({
			namespaces: {
				nsA: { a: { name: 'a' } },
			},
		});

		store.ejectReducers({ a: reducerA }, { namespace: 'nsA' });
		expect(store.getState()).toEqual({});

		store.injectReducers({ a: reducerA }, { namespace: 'nsA', feature: 'featureA' });
		expect(store.getState()).toEqual({
			featureA: {
				nsA: { a: { name: 'a' } },
			},
		});

		store.ejectReducers({ a: reducerA }, { namespace: 'nsA', feature: 'featureA' });
		expect(store.getState()).toEqual({});
	});

	it('removes data from state after ejecting (object reducers with preloaded state)', () => {
		store = createStore(identity as any, { preloadedStateObject: 'example' }, makeEnhancer());
		expect(store.getState()).toEqual({ preloadedStateObject: 'example' });

		store.injectReducers({ a: reducerA });
		expect(store.getState()).toEqual({
			preloadedStateObject: 'example',
			a: { name: 'a' },
		});

		store.ejectReducers({ a: reducerA });
		expect(store.getState()).toEqual({
			preloadedStateObject: 'example',
		});

		store.injectReducers({ a: reducerA }, { namespace: 'nsA' });
		expect(store.getState()).toEqual({
			preloadedStateObject: 'example',
			namespaces: {
				nsA: { a: { name: 'a' } },
			},
		});

		store.ejectReducers({ a: reducerA }, { namespace: 'nsA' });
		expect(store.getState()).toEqual({
			preloadedStateObject: 'example',
		});

		store.injectReducers({ a: reducerA }, { namespace: 'nsA', feature: 'featureA' });
		expect(store.getState()).toEqual({
			preloadedStateObject: 'example',
			featureA: {
				nsA: { a: { name: 'a' } },
			},
		});

		store.ejectReducers({ a: reducerA }, { namespace: 'nsA', feature: 'featureA' });
		expect(store.getState()).toEqual({
			preloadedStateObject: 'example',
		});
	});

	it('removes data from state after ejecting (function reducer without preloaded state)', () => {
		store = createStore(state => state, makeEnhancer());
		expect(store.getState()).toEqual(undefined);

		store.injectReducers(reducerA, { namespace: 'nsA' });
		expect(store.getState()).toEqual({
			namespaces: {
				nsA: { name: 'a' },
			},
		});

		store.ejectReducers(reducerA, { namespace: 'nsA' });
		expect(store.getState()).toEqual({});

		store.injectReducers(reducerA, { namespace: 'nsA', feature: 'featureA' });
		expect(store.getState()).toEqual({
			featureA: {
				nsA: { name: 'a' },
			},
		});

		store.ejectReducers(reducerA, { namespace: 'nsA', feature: 'featureA' });
		expect(store.getState()).toEqual({});
	});

	it('removes data from state after ejecting (function reducer with preloaded state)', () => {
		store = createStore(identity as any, { preloadedStateObject: 'example' }, makeEnhancer());
		expect(store.getState()).toEqual({ preloadedStateObject: 'example' });

		store.injectReducers(reducerA, { namespace: 'nsA' });
		expect(store.getState()).toEqual({
			preloadedStateObject: 'example',
			namespaces: {
				nsA: { name: 'a' },
			},
		});

		store.ejectReducers(reducerA, { namespace: 'nsA' });
		expect(store.getState()).toEqual({
			preloadedStateObject: 'example',
		});

		store.injectReducers(reducerA, { namespace: 'nsA', feature: 'featureA' });
		expect(store.getState()).toEqual({
			preloadedStateObject: 'example',
			featureA: {
				nsA: { name: 'a' },
			},
		});

		store.ejectReducers(reducerA, { namespace: 'nsA', feature: 'featureA' });
		expect(store.getState()).toEqual({
			preloadedStateObject: 'example',
		});
	});

	it('does not remove data from state after ejecting if the same entry is still present', () => {
		store = createStore(identity as any, { preloadedStateObject: 'example' }, makeEnhancer());
		expect(store.getState()).toEqual({ preloadedStateObject: 'example' });

		store.injectReducers({ a: reducerA });
		store.injectReducers({ a: reducerA });

		expect(store.getState()).toEqual({
			preloadedStateObject: 'example',
			a: { name: 'a' },
		});

		store.ejectReducers({ a: reducerA });

		expect(store.getState()).toEqual({
			preloadedStateObject: 'example',
			a: { name: 'a' },
		});

		store.ejectReducers({ a: reducerA });

		expect(store.getState()).toEqual({
			preloadedStateObject: 'example',
		});

		store.injectReducers({ a: reducerA }, { namespace: 'nsA' });
		store.injectReducers({ a: reducerA }, { namespace: 'nsA' });

		expect(store.getState()).toEqual({
			preloadedStateObject: 'example',
			namespaces: {
				nsA: { a: { name: 'a' } },
			},
		});

		store.ejectReducers({ a: reducerA }, { namespace: 'nsA' });

		expect(store.getState()).toEqual({
			preloadedStateObject: 'example',
			namespaces: {
				nsA: { a: { name: 'a' } },
			},
		});

		store.ejectReducers({ a: reducerA }, { namespace: 'nsA' });

		expect(store.getState()).toEqual({
			preloadedStateObject: 'example',
		});

		store.injectReducers({ a: reducerA }, { namespace: 'nsA', feature: 'featureA' });
		store.injectReducers({ a: reducerA }, { namespace: 'nsA', feature: 'featureA' });

		expect(store.getState()).toEqual({
			preloadedStateObject: 'example',
			featureA: {
				nsA: { a: { name: 'a' } },
			},
		});

		store.ejectReducers({ a: reducerA }, { namespace: 'nsA', feature: 'featureA' });

		expect(store.getState()).toEqual({
			preloadedStateObject: 'example',
			featureA: {
				nsA: { a: { name: 'a' } },
			},
		});

		store.ejectReducers({ a: reducerA }, { namespace: 'nsA', feature: 'featureA' });

		store.injectReducers(reducerA, { namespace: 'nsA' });
		store.injectReducers(reducerA, { namespace: 'nsA' });
		expect(store.getState()).toEqual({
			preloadedStateObject: 'example',
			namespaces: {
				nsA: { name: 'a' },
			},
		});

		store.ejectReducers(reducerA, { namespace: 'nsA' });

		expect(store.getState()).toEqual({
			preloadedStateObject: 'example',
			namespaces: {
				nsA: { name: 'a' },
			},
		});

		store.ejectReducers(reducerA, { namespace: 'nsA' });
		expect(store.getState()).toEqual({
			preloadedStateObject: 'example',
		});

		store.injectReducers(reducerA, { namespace: 'nsA', feature: 'featureA' });
		store.injectReducers(reducerA, { namespace: 'nsA', feature: 'featureA' });
		expect(store.getState()).toEqual({
			preloadedStateObject: 'example',
			featureA: {
				nsA: { name: 'a' },
			},
		});

		store.ejectReducers(reducerA, { namespace: 'nsA', feature: 'featureA' });
		expect(store.getState()).toEqual({
			preloadedStateObject: 'example',
			featureA: {
				nsA: { name: 'a' },
			},
		});

		store.ejectReducers(reducerA, { namespace: 'nsA', feature: 'featureA' });
		expect(store.getState()).toEqual({
			preloadedStateObject: 'example',
		});
	});

	it('handles initial reducers', () => {
		const options = {
			initialReducers: {
				reducerStateA: (state = { nameA: 'A' }, action: AnyAction) =>
					action.type === 'exampleA'
						? {
								...state,
								payload: action.payload,
						  }
						: state,
			},
		};

		store = createStore(identity, makeEnhancer(options));

		expect(store.getState()).toEqual({
			reducerStateA: { nameA: 'A' },
		});

		store.dispatch({ type: 'exampleA', payload: 'payload' });

		expect(store.getState()).toEqual({
			reducerStateA: { nameA: 'A', payload: 'payload' },
		});
	});

	it('can process initial reducers with later injected reducers', () => {
		const reducerMockB = (state = { nameB: 'B' }, action: AnyAction) =>
			action.type === 'exampleB'
				? {
						...state,
						payload: action.payload,
				  }
				: state;

		const options = {
			initialReducers: {
				reducerStateA: (state = { nameA: 'A' }) => state,
			},
		};

		store = createStore(identity, makeEnhancer(options));

		store.injectReducers({ reducerStateB: reducerMockB });
		store.dispatch({ type: 'exampleB', payload: 'payload' });

		expect(store.getState()).toEqual({
			reducerStateA: { nameA: 'A' },
			reducerStateB: { nameB: 'B', payload: 'payload' },
		});
	});
});
