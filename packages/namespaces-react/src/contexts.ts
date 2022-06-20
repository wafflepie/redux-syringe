import { createContext } from 'react';

import { alwaysNull } from '@redux-syringe/utils';

import { NamespacesByFeature, UseExternalNamespace } from './types';

export interface NamespaceContextValue {
	isUseNamespaceProvided?: boolean;
	namespaces?: NamespacesByFeature;
	useNamespace?: UseExternalNamespace;
}

export const NamespaceContext = createContext<NamespaceContextValue>({
	isUseNamespaceProvided: false,
	namespaces: {},
	useNamespace: alwaysNull,
});
