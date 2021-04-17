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

export {
	composeReducers,
	makeEnhancer as makeReducersEnhancer,
	makeReducer,
	combineReducers,
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
