import { mergeDeepWith, flip, or } from 'ramda';
import React, { ReactElement, ReactNode, useContext, useMemo } from 'react';
import { Provider as ReactReduxProvider } from 'react-redux';
import type { Store } from 'redux';

import { DEFAULT_FEATURE, Feature, Namespace } from '@redux-syringe/namespaces';

import { NamespaceContext } from './contexts';
import { UseExternalNamespace } from './types';

// NOTE: We use `flip(or)` so falsy values won't override existing truthy ones.
const mergeContextValues = mergeDeepWith(flip(or));

export interface NamespaceProviderProps {
	children: ReactNode;
	feature?: Feature;
	namespace?: Namespace;
	store?: Store;
	useNamespace?: UseExternalNamespace;
}

export const NamespaceProvider = ({
	children,
	feature,
	namespace,
	store,
	useNamespace,
}: NamespaceProviderProps): ReactElement => {
	const context = useContext(NamespaceContext);

	const nextContext = useMemo(
		() =>
			mergeContextValues(context, {
				namespaces: { [feature ?? DEFAULT_FEATURE]: namespace },
				useNamespace,
				isUseNamespaceProvided: Boolean(useNamespace),
			}),
		[context, feature, namespace, useNamespace]
	);

	const providerElement = (
		<NamespaceContext.Provider value={nextContext}>{children}</NamespaceContext.Provider>
	);

	return store ? (
		<ReactReduxProvider store={store}>{providerElement}</ReactReduxProvider>
	) : (
		providerElement
	);
};
