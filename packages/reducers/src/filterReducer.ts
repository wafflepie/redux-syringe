import type { Reducer } from 'redux';

import { isActionFromNamespace, Namespace } from '@redux-syringe/namespaces';

export const filterReducer =
	(reducer: Reducer, namespace?: Namespace): Reducer =>
	(state, action) =>
		isActionFromNamespace(namespace, action) ? reducer(state, action) : state;
