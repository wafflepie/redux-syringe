// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../actions.d.ts" />

// NOTE: We need to list all exports manually because of potential naming collisions.
export {
	isErrorAction,
	isNotErrorAction,
	configureActionCreator,
	makeActionTypes,
	makeEmptyActionCreator,
	makePayloadActionCreator,
	makeConstantActionCreator,
	makeSimpleActionCreator,
	makePayloadMetaActionCreator,
} from '@redux-syringe/actions';

export {
	makeEnhancer as makeMiddlewareEnhancer,
	composeMiddleware,
} from '@redux-syringe/middleware';

export type {
	MiddlewareApi,
	MiddlewareNamespaceApi,
	MiddlewareEnhancer,
} from '@redux-syringe/middleware';

export { useMiddleware, withMiddleware } from '@redux-syringe/middleware-react';

export {
	attachNamespace,
	defaultNamespace,
	preventNamespace,
	getNamespaceByAction,
	isActionFromNamespace,
	getStateByAction,
	getStateByFeatureAndAction,
	getStateByNamespace,
	getStateByFeatureAndNamespace,
} from '@redux-syringe/namespaces';

export type {
	ActionLike,
	Feature,
	FeatureAndNamespace,
	Namespace,
	NamespacedActionLike,
} from '@redux-syringe/namespaces';

export {
	composeReducers,
	makeEnhancer as makeReducersEnhancer,
	makeReducer,
	combineReducers,
} from '@redux-syringe/reducers';

export type {
	ReducerKey,
	ReducerSchema,
	ReducersEnhancer,
	ReducersEnhancerOptions,
} from '@redux-syringe/reducers';

export { useReducers, withReducers } from '@redux-syringe/reducers-react';

export {
	namespacedConnect,
	useNamespace,
	NamespaceProvider,
	withNamespaceProvider,
	useNamespacedSelector,
	useNamespacedDispatch,
} from '@redux-syringe/namespaces-react';

export type { NamespacesByFeature, UseExternalNamespace } from '@redux-syringe/namespaces-react';

export { thunkMiddleware } from '@redux-syringe/thunk';

export type {
	Thunk,
	ThunkDispatch,
	ThunkMiddleware,
	ThunkMiddlewareWithDependencies,
} from '@redux-syringe/thunk';
