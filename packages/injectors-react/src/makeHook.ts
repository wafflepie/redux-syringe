import invariant from 'invariant';
import { all, includes, omit, isNil, reject } from 'ramda';
import { useLayoutEffect, useState, useEffect, useDebugValue, useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import type { Store } from 'redux';

import {
	createEntries,
	InjectorStoreInterface,
	Injectables,
	Injectable,
	InjectorStore,
	InjectorMethod,
} from '@redux-syringe/injectors';
import { DEFAULT_FEATURE } from '@redux-syringe/namespaces';
import { useNamespace, NamespaceContext } from '@redux-syringe/namespaces-react';
import { capitalize } from '@redux-syringe/utils';

import { IS_SERVER } from './constants';
import { InjectorHook, InjectorOptions } from './types';

const useUniversalLayoutEffect = IS_SERVER ? useEffect : useLayoutEffect;
const getOtherProps = omit(['isGlobal', 'global', 'isPersistent', 'persist']);

export const makeHook = <
	TInjectable extends Injectable,
	TInjectorStoreInterface extends InjectorStoreInterface<TInjectable, string>
>(
	storeInterface: TInjectorStoreInterface
): InjectorHook<TInjectable> => {
	invariant(storeInterface, 'The store interface is falsy.');

	const { getEntries, ejectionKey, injectionKey, type } = storeInterface;

	const capitalizedType = capitalize(type);
	const hookName = `use${capitalizedType}`;

	const useInjectables = (injectables: Injectables<TInjectable>, options: InjectorOptions = {}) => {
		const locationMessages = [`@redux-syringe ${type}`, injectables];

		const warn = (...args: any[]) => console.warn(...locationMessages, ...args);

		// NOTE: `options.global` and `options.persist` are deprecated.
		const isGlobal = options.isGlobal ?? options.global ?? false;
		const isPersistent = options.isPersistent ?? options.persist ?? false;
		const isNamespaced = options.isNamespaced ?? false;
		const feature = options.feature ?? DEFAULT_FEATURE;
		const contextNamespace = useNamespace(feature);

		const store = useContext(ReactReduxContext).store as Store &
			InjectorStore<TInjectable, TInjectorStoreInterface>;

		const { isUseNamespaceProvided } = useContext(NamespaceContext);

		const namespace = isGlobal ? null : options.namespace ?? contextNamespace;

		const inject = (store as any)[injectionKey] as InjectorMethod<TInjectable>;
		const eject = (store as any)[ejectionKey] as InjectorMethod<TInjectable>;

		// NOTE: On the server, the injectables should be injected beforehand.
		const [isInitialized, setIsInitialized] = useState(IS_SERVER);

		const props = reject(isNil, {
			...getOtherProps(options),
			feature,
			namespace,
		});

		// TODO: Refactor when React DevTools support multiple debug values or non-primitive structures.
		useDebugValue(
			String([
				`Namespace: ${namespace}`,
				`Feature: ${feature}`,
				`Type: ${capitalizedType}`,
				`Initialized: ${isInitialized}`,
			])
		);

		if (IS_SERVER) {
			const areEntriesAlreadyInjected = all(
				entry => includes(entry, getEntries(store)),
				createEntries(injectables, props)
			);

			if (!areEntriesAlreadyInjected) {
				warn(
					`When rendering on the server, inject all ${type} before calling`,
					"'ReactDOMServer.renderToString()'. You should do this inside an",
					"'async getInitialProps()' function, i.e. where you fetch data and",
					'do other side effects. If you need to do server-side injections',
					'during rendering, open an issue.'
				);
			}
		}

		const effectDependencies = [
			namespace,
			feature,
			isGlobal,
			isPersistent,
			inject,
			eject,
			injectables,
		];

		// NOTE: This doesn't run on the server, but won't trigger `useLayoutEffect` warnings either.
		useUniversalLayoutEffect(() => {
			if (isGlobal && feature !== DEFAULT_FEATURE) {
				warn(
					`You are using a feature (${feature}) with global ${type}.`,
					'This will have no effect.'
				);
			}

			if (isUseNamespaceProvided && isNil(namespace) && !isGlobal) {
				warn(
					`You're injecting ${type}, but the namespace could not be resolved from React context!`,
					'They will be injected globally. If this is intended, consider passing',
					`'isGlobal: true' to the injector, e.g. '${hookName}(${type}, { isGlobal: true })'.`
				);
			}

			if (!isNil(options.global)) {
				warn(`'global: ${options.global}' is deprecated. Use 'isGlobal: ${options.global}'.`);
			}

			if (!isNil(options.persist)) {
				warn(
					`'persist: ${options.persist}' is deprecated. Use 'isPersistent: ${options.persist}'.`
				);
			}

			invariant(
				!isNamespaced || !isNil(namespace),
				`You're injecting ${type} marked as namespaced, but no namespace could be resolved.`
			);

			invariant(inject, `'store.${injectionKey}' missing. Are you using the enhancer correctly?`);
			invariant(eject, `'store.${ejectionKey}' missing. Are you using the enhancer correctly?`);

			inject(injectables, props);
			setIsInitialized(true);

			return () => {
				if (!isPersistent) {
					eject(injectables, props);
				}
			};
		}, effectDependencies);

		return isInitialized;
	};

	return useInjectables;
};
