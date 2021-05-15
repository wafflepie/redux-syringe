import { reduce, o, assocPath, path } from 'ramda';
import type { Reducer } from 'redux';

import { InjectableEntry } from '@redux-syringe/injectors';
import { DEFAULT_FEATURE } from '@redux-syringe/namespaces';

import { combineReducerSchema } from './combineReducerSchema';
import { ROOT_KEY } from './constants';
import { filterReducer } from './filterReducer';
import { ReducerSchema } from './types';

export const combineReducerEntries = o(
	combineReducerSchema,
	reduce<InjectableEntry<Reducer>, ReducerSchema>((schema, entry) => {
		const pathDefinition = [
			...(entry.namespace ? [entry.feature ?? DEFAULT_FEATURE] : []),
			...(entry.namespace ? [entry.namespace] : []),
			...entry.path,
			ROOT_KEY,
		];

		return assocPath(
			pathDefinition,
			[
				...((path(pathDefinition, schema) as Reducer[]) ?? []),
				filterReducer(entry.value, entry.namespace),
			],
			schema
		);
	}, {})
);
