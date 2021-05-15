import { reduceRight } from 'ramda';
import type { Reducer } from 'redux';

export const composeReducers =
	(...reducers: Reducer[]): Reducer =>
	(state, action) =>
		reduceRight((reducer, currentState) => reducer(currentState, action), state, reducers);
