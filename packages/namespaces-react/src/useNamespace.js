import { alwaysNull } from 'ramda-extension';
import { useContext } from 'react';

import { DEFAULT_FEATURE } from '@redux-syringe/namespaces';

import { NamespaceContext } from './contexts';

const useNamespace = feature => {
	const { namespaces = {}, useNamespace: useExternalNamespace = alwaysNull } = useContext(
		NamespaceContext
	);

	const externalNamespace = useExternalNamespace(feature ?? DEFAULT_FEATURE, namespaces);

	return namespaces[feature ?? DEFAULT_FEATURE] ?? externalNamespace ?? null;
};

export default useNamespace;
