import invariant from 'invariant';
import { o, path } from 'ramda';

import { capitalize } from '@redux-syringe/utils';

import { Injectable, InjectorStoreInterface, InjectableEntry, InjectorStoreEntries } from './types';

export const makeStoreInterface = <
	TInjectable extends Injectable,
	TInjectablePluralName extends string
>(
	type: TInjectablePluralName
): InjectorStoreInterface<TInjectable, TInjectablePluralName> => {
	invariant(type, 'The type of the injectables must be defined.');

	return {
		type,
		injectionKey: `inject${capitalize(type)}` as `inject${Capitalize<TInjectablePluralName>}`,
		ejectionKey: `eject${capitalize(type)}` as `eject${Capitalize<TInjectablePluralName>}`,

		getEntries: o(
			(entries?: InjectableEntry<TInjectable>[]) => entries ?? [],
			path(['entries', type])
		),

		setEntries: (entries, store) => {
			// eslint-disable-next-line no-param-reassign
			store.entries = { ...store.entries, [type]: entries } as InjectorStoreEntries<
				TInjectable,
				TInjectablePluralName
			>;
		},
	};
};
