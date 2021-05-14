import { createContext } from 'react';

import { alwaysNull } from '@redux-syringe/utils';

import { Namespaces, UseExternalNamespace } from './types';

interface NamespaceContextValue {
	isUseNamespaceProvided?: boolean;
	namespaces?: Namespaces;
	useNamespace?: UseExternalNamespace;
}

export const NamespaceContext = createContext<NamespaceContextValue>({
	isUseNamespaceProvided: false,
	namespaces: {},
	useNamespace: alwaysNull,
});
