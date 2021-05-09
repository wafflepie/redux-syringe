import PropTypes from 'prop-types';
import { mergeDeepWith, flip, or } from 'ramda';
import React, { useContext, useMemo } from 'react';
import { Provider as ReactReduxProvider } from 'react-redux';

import { DEFAULT_FEATURE } from '@redux-syringe/namespaces';

import { NamespaceContext } from './contexts';

// NOTE: We use `flip(or)` so falsy values won't override existing truthy ones.
const mergeContextValues = mergeDeepWith(flip(or));

const NamespaceProvider = ({ children, feature, namespace, store, useNamespace }) => {
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

NamespaceProvider.propTypes = {
	children: PropTypes.node.isRequired,
	feature: PropTypes.string,
	namespace: PropTypes.string,
	store: PropTypes.shape({
		dispatch: PropTypes.func.isRequired,
		getState: PropTypes.func.isRequired,
	}),
	useNamespace: PropTypes.func,
};

export default NamespaceProvider;
