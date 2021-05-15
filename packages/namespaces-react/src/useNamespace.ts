import { useContext } from 'react';

import { DEFAULT_FEATURE, Feature, Namespace } from '@redux-syringe/namespaces';
import { alwaysNull } from '@redux-syringe/utils';

import { NamespaceContext } from './contexts';

export const useNamespace = (feature?: Feature): Namespace | undefined => {
	const { namespaces = {}, useNamespace: useExternalNamespace = alwaysNull } =
		useContext(NamespaceContext);

	const externalNamespace = useExternalNamespace(feature ?? DEFAULT_FEATURE, namespaces);

	return namespaces[feature ?? DEFAULT_FEATURE] ?? externalNamespace ?? undefined;
};
