import { o, chain, map, toPairs, mergeRight, isNil, reject } from 'ramda';

import { DEFAULT_FEATURE, FeatureAndNamespace } from '@redux-syringe/namespaces';

import { Injectable, InjectableEntry, InjectableKey, Injectables } from './types';

const createPathValueEntries = <TInjectable extends Injectable = Injectable>(
	injectables?: Injectables<TInjectable>
): InjectableEntry<TInjectable>[] => {
	if (!injectables) {
		return [];
	}

	if (typeof injectables === 'function') {
		return [{ path: [], value: injectables }];
	}

	if (Array.isArray(injectables)) {
		return chain(createPathValueEntries, injectables);
	}

	if (typeof injectables === 'object') {
		const createEntriesFromPair = (pair: [InjectableKey, Injectables<TInjectable>]) => {
			const entries = createPathValueEntries(pair[1]);

			const prependEntryPath = (entry: InjectableEntry<TInjectable>) => ({
				...entry,
				path: [pair[0], ...entry.path],
			});

			return map(prependEntryPath, entries);
		};

		return o(chain(createEntriesFromPair), toPairs)(injectables);
	}

	return [];
};

/**
 * Converts the input of `store.injectSomething()` or `store.ejectSomething()`
 * to an array of standalone entries.
 */
export const createEntries = <TInjectable extends Injectable = Injectable>(
	injectables?: Injectables<TInjectable>,
	{ feature, namespace }: Partial<FeatureAndNamespace> = {}
): InjectableEntry<TInjectable>[] => {
	const sanitizedProps: Partial<FeatureAndNamespace> = reject(isNil, {
		namespace,
		feature: namespace ? feature ?? DEFAULT_FEATURE : null,
	});

	const rawEntries = createPathValueEntries(injectables);
	const addPropsToEntries = map(mergeRight(sanitizedProps));

	return addPropsToEntries(rawEntries);
};
