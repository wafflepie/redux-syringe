import { reduce, keys } from 'ramda';
import type { Reducer } from 'redux';

import { pickFunctions } from '@redux-syringe/utils';

import { ShallowReducers } from './types';

// NOTE: Custom implementation so existing keys are always preserved.
export const combineReducers = (reducers: ShallowReducers): Reducer => {
	const finalReducers = pickFunctions(reducers);
	const finalReducerKeys = keys(finalReducers);

	return (state = {}, action) =>
		reduce(
			(previousState, reducerKey) => {
				const reducer = finalReducers[reducerKey];
				const previousStateForKey = previousState[reducerKey];
				const nextStateForKey = reducer(previousStateForKey, action);

				if (nextStateForKey === previousStateForKey) {
					return previousState;
				}

				return {
					...previousState,
					[reducerKey]: nextStateForKey,
				};
			},
			state,
			finalReducerKeys
		);
};
