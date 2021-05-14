import { identity } from 'ramda';
import { createStore, applyMiddleware, Middleware } from 'redux';

import { attachNamespace, getNamespaceByAction } from '@redux-syringe/namespaces';

import { Thunk, thunkMiddleware } from './thunkMiddleware';

declare module 'redux' {
	export interface Dispatch<A extends Action = AnyAction> {
		<R = any, S = any, N = any, D extends Record<string, unknown> = Record<string, unknown>>(
			thunk: Thunk<R, S, A, N, D>
		): R;
	}
}

describe('thunkMiddleware', () => {
	const listener = jest.fn();

	const listenerMiddleware: Middleware = () => next => action => {
		listener(action);
		next(action);
	};

	const store = createStore(identity, applyMiddleware(thunkMiddleware, listenerMiddleware));

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('lets objects through', () => {
		const action = { type: 'BEARS' };
		store.dispatch(action);
		expect(listener).toHaveBeenCalledWith(action);
	});

	it('handles thunks without a namespace', () => {
		const action = { type: 'BEETS' };

		store.dispatch(({ dispatch }) => {
			dispatch(action);
		});

		expect(listener).toHaveBeenCalledWith(action);
	});

	it('handles thunks with a namespace', () => {
		const action = { type: 'BATTLESTAR_GALACTICA' };

		store.dispatch(
			attachNamespace('MICHAEL', (({ dispatch }) => {
				dispatch(action);
			}) as Thunk)
		);

		expect(listener).toHaveBeenCalledTimes(1);
		expect(listener.mock.calls[0][0].type).toEqual(action.type);
		expect(getNamespaceByAction(listener.mock.calls[0][0])).toEqual('MICHAEL');
	});
});
