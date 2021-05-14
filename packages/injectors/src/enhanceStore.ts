/* eslint-disable no-use-before-define */
import invariant from 'invariant';
import { pluck, concat, toUpper } from 'ramda';
import type { Store } from 'redux';

import { FeatureAndNamespace } from '@redux-syringe/namespaces';
import { withoutOnce, noop } from '@redux-syringe/utils';

import { createEntries } from './createEntries';
import {
	Injectables,
	InjectorStoreInterface,
	InjectorStore,
	Injectable,
	InjectorCallbacks,
} from './types';

export const enhanceStore = <
	TStore extends Store<any, any>,
	TInjectable extends Injectable,
	TInjectorStoreInterface extends InjectorStoreInterface<TInjectable, string>
>(
	prevStore: TStore,
	storeInterface: TInjectorStoreInterface,
	{ onEjected = noop, onInjected = noop }: InjectorCallbacks<TInjectable> = {}
): TStore & InjectorStore<TInjectable, TInjectorStoreInterface> => {
	invariant(
		prevStore && typeof prevStore === 'object',
		'You must pass a Redux store as the first argument to `enhanceStore()`'
	);

	invariant(
		prevStore && typeof prevStore === 'object',
		'You must pass a store interface as the second argument to `enhanceStore()`'
	);

	const { injectionKey, ejectionKey, getEntries, setEntries, type } = storeInterface;
	const { dispatch = noop } = prevStore;
	const actionType = toUpper(type);

	const inject = (
		injectables: Injectables<TInjectable>,
		props: Partial<FeatureAndNamespace> = {}
	) => {
		const entries = createEntries(injectables, props);

		const nextEntries = concat(getEntries(nextStore), entries);
		setEntries(nextEntries, nextStore);
		onInjected({ injectables, props, entries });

		dispatch({
			type: `@redux-syringe/${actionType}_INJECTED`,
			payload: pluck('path', entries),
			meta: props,
		});
	};

	const eject = (
		injectables: Injectables<TInjectable>,
		props: Partial<FeatureAndNamespace> = {}
	) => {
		const entries = createEntries(injectables, props);
		const nextEntries = withoutOnce(entries, getEntries(nextStore));
		setEntries(nextEntries, nextStore);
		onEjected({ injectables, props, entries });

		dispatch({
			type: `@redux-syringe/${actionType}_EJECTED`,
			payload: pluck('path', entries),
			meta: props,
		});
	};

	const nextStore = {
		...prevStore,
		[injectionKey]: inject,
		[ejectionKey]: eject,
	} as TStore & InjectorStore<TInjectable, TInjectorStoreInterface>;

	setEntries([], nextStore);

	return nextStore;
};
