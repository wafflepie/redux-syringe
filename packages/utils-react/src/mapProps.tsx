import hoistNonReactStatics from 'hoist-non-react-statics';
import React, { ComponentType } from 'react';

import { getDisplayName } from './getDisplayName';

export const mapProps =
	<TInner, TOuter>(getProps: (input: TOuter) => TInner) =>
	(NextComponent: ComponentType<TInner>): ComponentType<TOuter> => {
		const MapProps = (props: TOuter) => <NextComponent {...getProps(props)} />;

		hoistNonReactStatics(MapProps, NextComponent);

		MapProps.displayName = `MapProps(${getDisplayName(NextComponent)})`;

		return MapProps;
	};
