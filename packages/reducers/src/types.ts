import type { Reducer } from 'redux';

export type ReducerKey = string;

export type ReducerSchema = {
	// NOTE: Property is of type `Reducer[]` iff `reducerKey` is `ROOT_KEY`.
	[reducerKey: string]: Reducer[] | ReducerSchema;
};
