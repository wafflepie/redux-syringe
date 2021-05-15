import { map, isEmpty } from 'ramda';
import type { Reducer } from 'redux';

import { combineReducers } from './combineReducers';
import { composeReducers } from './composeReducers';
import { ROOT_KEY } from './constants';
import { ReducerKey, ReducerSchema } from './types';

export const combineReducerSchema = ({
	[ROOT_KEY]: rootReducers,
	...otherReducers
}: ReducerSchema): Reducer => {
	const resolvedRootReducers = (rootReducers as Reducer[]) ?? [];

	if (isEmpty(otherReducers)) {
		return composeReducers(...resolvedRootReducers);
	}

	return composeReducers(
		...resolvedRootReducers,
		combineReducers(map(combineReducerSchema, otherReducers as Record<ReducerKey, ReducerSchema>))
	);
};
