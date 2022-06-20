import hoistNonReactStatics from 'hoist-non-react-statics';
import { mergeLeft } from 'ramda';
import React, { ComponentType } from 'react';

import { getDisplayName } from '@redux-syringe/utils-react';

import { NamespaceProvider, NamespaceProviderProps } from './NamespaceProvider';

type WithNamespaceProviderOptions = Omit<Partial<NamespaceProviderProps>, 'children'>;

export const withNamespaceProvider =
	(options: WithNamespaceProviderOptions) =>
	<TProps extends unknown>(
		NextComponent: ComponentType<TProps>
	): ComponentType<TProps & WithNamespaceProviderOptions> => {
		const WithNamespaceProvider = (props: TProps & WithNamespaceProviderOptions) => (
			// NOTE: `NamespaceProvider` will ignore any unknown props.
			<NamespaceProvider {...mergeLeft(options, props)}>
				<NextComponent {...props} />
			</NamespaceProvider>
		);

		hoistNonReactStatics(WithNamespaceProvider, NextComponent);

		WithNamespaceProvider.displayName = `WithNamespaceProvider(${getDisplayName(NextComponent)})`;

		return WithNamespaceProvider;
	};
