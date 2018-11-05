import React from 'react';
import { identity } from 'ramda';

import { InjectorContext } from './contexts';

export default function withInjectorContext(NextComponent) {
	const WithInjectorContext = props => (
		<InjectorContext.Consumer>
			{({ withNamespace = identity, store }) => {
				// NOTE: React's reconciliation process would otherwise think that we're rendering
				// two different components (because we would be creating a new one each render).
				// TODO: Allow changing the `withNamespace` prop.
				if (!WithInjectorContext.WrappedComponent) {
					WithInjectorContext.WrappedComponent = withNamespace(NextComponent);
				}

				return <WithInjectorContext.WrappedComponent store={store} {...props} />;
			}}
		</InjectorContext.Consumer>
	);

	// NOTE: We attach `WrappedComponent` to `WithInjectorContext` because of tests.
	WithInjectorContext.WrappedComponent = null;

	return WithInjectorContext;
}
