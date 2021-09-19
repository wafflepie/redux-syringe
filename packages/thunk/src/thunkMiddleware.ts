import type { Action } from 'redux';

import {
	getNamespaceByAction,
	defaultNamespace,
	getStateByFeatureAndNamespace,
	DEFAULT_FEATURE,
	Feature,
} from '@redux-syringe/namespaces';

import { AnyObject, Thunk, ThunkMiddlewareWithDependencies } from './types';

const makeThunkMiddleware = (dependencies?: AnyObject) => {
	const middleware: ThunkMiddlewareWithDependencies =
		({ dispatch, getState }) =>
		next =>
		(action: Action | Thunk) => {
			if (typeof action === 'function') {
				const namespace = getNamespaceByAction(action);

				const getNamespacedState = <TNamespacedState>(feature?: Feature) => {
					if (!namespace) {
						return undefined;
					}

					const namespacedState = getStateByFeatureAndNamespace(
						feature ?? DEFAULT_FEATURE,
						namespace,
						getState()
					);

					return namespacedState as TNamespacedState | undefined;
				};

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
