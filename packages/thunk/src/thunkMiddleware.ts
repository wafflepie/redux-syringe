import type { Action, AnyAction, Middleware } from 'redux';

import {
	getNamespaceByAction,
	defaultNamespace,
	getStateByFeatureAndNamespace,
	DEFAULT_FEATURE,
	Feature,
	Namespace,
} from '@redux-syringe/namespaces';

type AnyObject = Record<string, unknown>;

export type Thunk<
	R = any,
	S = any,
	A extends Action = AnyAction,
	N = any,
	D extends AnyObject = AnyObject
> = (
	thunkApi: D & {
		dispatch: ThunkDispatch<S, A, N, D>;
		getNamespacedState: (feature?: Feature) => N | undefined;
		getState: () => S;
		namespace?: Namespace;
	}
) => R;

export interface ThunkDispatch<
	S = any,
	A extends Action = AnyAction,
	N = any,
	D extends AnyObject = AnyObject
> {
	<R>(thunk: Thunk<R, S, A, N, D>): R;
	<T extends A>(action: T): T;
	<R, T extends A>(action: T | Thunk<R, S, A, N, D>): T | R;
}

export type ThunkMiddleware<
	S = any,
	A extends Action = AnyAction,
	N = any,
	D extends AnyObject = AnyObject
> = Middleware<ThunkDispatch<S, A, N, D>, S, ThunkDispatch<S, A, N, D>>;

export type ThunkMiddlewareWithDependencies = ThunkMiddleware & {
	withDependencies<S = any, A extends Action = AnyAction, N = any, D extends AnyObject = AnyObject>(
		dependencies: D
	): ThunkMiddleware<S, A, N, D>;
};

const makeThunkMiddleware = (dependencies?: AnyObject) => {
	const middleware: ThunkMiddlewareWithDependencies =
		({ dispatch, getState }) =>
		next =>
		(action: Action | Thunk) => {
			if (typeof action === 'function') {
				const namespace = getNamespaceByAction(action);

				const getNamespacedState = (feature?: Feature) =>
					namespace
						? getStateByFeatureAndNamespace(feature ?? DEFAULT_FEATURE, namespace, getState())
						: undefined;

				const thunkApiDispatch = (otherAction: Action | Thunk) =>
					dispatch(namespace ? defaultNamespace(namespace, otherAction) : otherAction);

				return action({
					dispatch: thunkApiDispatch,
					getState,
					namespace,
					getNamespacedState,
					...dependencies,
				});
			}

			return next(action);
		};

	middleware.withDependencies = makeThunkMiddleware;

	return middleware;
};

export const thunkMiddleware = makeThunkMiddleware();
