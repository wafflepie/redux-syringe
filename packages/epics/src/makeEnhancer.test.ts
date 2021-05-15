import { identity, compose } from 'ramda';
import { createStore, applyMiddleware, Middleware, AnyAction } from 'redux';
import { createEpicMiddleware, ofType } from 'redux-observable';
import { Subject, Observable } from 'rxjs';
import * as Rx from 'rxjs/operators';

import { makeEnhancer } from './makeEnhancer';

const incrementEpic = (action$: Observable<AnyAction>) =>
	action$.pipe(
		ofType('PING'),
		Rx.map(action => ({
			type: 'PONG',
			payload: action.payload + 1,
		}))
	);

describe('makeEnhancer', () => {
	const logger = jest.fn();
	const dependencies = { dependency: 'dependency' };

	const loggerMiddleware: Middleware = () => next => action => {
		next(action);
		logger(action);
	};

	const configureEpicMiddleware = () => createEpicMiddleware({ dependencies });

	const configureStore = (epicMiddleware: ReturnType<typeof configureEpicMiddleware>) =>
		createStore(
			identity,
			compose(makeEnhancer({ epicMiddleware }), applyMiddleware(epicMiddleware, loggerMiddleware))
		);

	let epicMiddleware = configureEpicMiddleware();
	let store = configureStore(epicMiddleware);

	beforeEach(() => {
		jest.clearAllMocks();
		epicMiddleware = configureEpicMiddleware();
		store = configureStore(epicMiddleware);
	});

	it('returns a Redux store with defined functions', () => {
		expect(store.injectEpics).toBeInstanceOf(Function);
		expect(store.ejectEpics).toBeInstanceOf(Function);
	});

	it('runs an epic in the supplied middleware', () => {
		epicMiddleware = jest.fn() as any;
		epicMiddleware.run = jest.fn();
		const enhancer = makeEnhancer({ epicMiddleware });
		createStore(identity, enhancer);
		expect(epicMiddleware.run).toHaveBeenCalled();
	});

	it('passes actions to an injected epic', () => {
		store.injectEpics(incrementEpic);
		jest.clearAllMocks();
		store.dispatch({ type: 'PING', payload: 1 });
		expect(logger).toHaveBeenCalledTimes(2);
		expect(logger.mock.calls[1][0]).toEqual({ type: 'PONG', payload: 2 });
	});

	it('handles same epics with different keys', () => {
		store.injectEpics({ foo: incrementEpic });
		store.injectEpics({ bar: incrementEpic });
		jest.clearAllMocks();
		store.dispatch({ type: 'PING', payload: 1 });
		expect(logger).toHaveBeenCalledTimes(3);
		expect(logger.mock.calls[1][0]).toEqual({ type: 'PONG', payload: 2 });
		expect(logger.mock.calls[2][0]).toEqual({ type: 'PONG', payload: 2 });
	});

	it('adds namespace to emitted actions', () => {
		store.injectEpics({ foo: incrementEpic }, { namespace: 'ns' });
		jest.clearAllMocks();
		store.dispatch({ type: 'PING', payload: 1 });
		expect(logger).toHaveBeenCalledTimes(2);
		expect(logger.mock.calls[1][0]).toEqual({
			type: 'PONG',
			payload: 2,
			meta: { namespace: 'ns' },
		});
	});

	it('passes only valid actions to a namespaced epic', () => {
		store.injectEpics({ foo: incrementEpic }, { namespace: 'ns' });
		jest.clearAllMocks();
		store.dispatch({ type: 'PING', payload: 1 });
		store.dispatch({ type: 'PING', payload: 2, meta: { namespace: 'ns' } });
		store.dispatch({ type: 'PING', payload: 3, meta: { namespace: 'other' } });
		expect(logger).toHaveBeenCalledTimes(5);

		expect(logger.mock.calls[1][0]).toEqual({
			type: 'PONG',
			payload: 2,
			meta: { namespace: 'ns' },
		});

		expect(logger.mock.calls[3][0]).toEqual({
			type: 'PONG',
			payload: 3,
			meta: { namespace: 'ns' },
		});
	});

	it('stops an epic when ejected', () => {
		store.injectEpics({ foo: incrementEpic }, { namespace: 'ns' });
		store.ejectEpics({ foo: incrementEpic }, { namespace: 'ns' });
		jest.clearAllMocks();
		store.dispatch({ type: 'PING', payload: 1 });
		expect(logger).toHaveBeenCalledTimes(1);
	});

	it('passes correct arguments to the epic when streamCreator is omitted', () => {
		const epic = jest.fn<Subject<unknown>, any>(() => new Subject());
		store.injectEpics({ foo: epic }, { namespace: 'ns' });
		expect(epic).toHaveBeenCalledTimes(1);
		expect(epic.mock.calls[0][0]).toBeInstanceOf(Observable);
		expect(epic.mock.calls[0][1]).toBeInstanceOf(Observable);
		expect(epic.mock.calls[0][2]).toEqual(dependencies);
	});

	it('passes correct arguments to the epic when streamCreator is defined', () => {
		const streamCreator = jest.fn(() => 'streamCreator');
		epicMiddleware = createEpicMiddleware({ dependencies });
		const enhancer = makeEnhancer({ epicMiddleware, streamCreator });

		store = createStore(
			identity,
			compose(enhancer, applyMiddleware(epicMiddleware, loggerMiddleware))
		);

		const epic = jest.fn<Subject<unknown>, any>(() => new Subject());
		store.injectEpics({ foo: epic }, { namespace: 'ns' });
		expect(epic).toHaveBeenCalledTimes(1);
		expect(epic.mock.calls[0][0]).toBeInstanceOf(Observable);
		expect(epic.mock.calls[0][1]).toBeInstanceOf(Observable);
		expect(epic.mock.calls[0][2]).toEqual('streamCreator');
		expect(epic.mock.calls[0][3]).toEqual(dependencies);

		expect(streamCreator).toHaveBeenCalledTimes(1);
	});
});
