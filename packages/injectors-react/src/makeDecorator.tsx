import hoistNonReactStatics from 'hoist-non-react-statics';
import invariant from 'invariant';
import React, { ComponentType } from 'react';

import { Injectable, InjectorStoreInterface } from '@redux-syringe/injectors';
import { DEFAULT_FEATURE, FeatureAndNamespace } from '@redux-syringe/namespaces';
import { useNamespace } from '@redux-syringe/namespaces-react';
import { capitalize } from '@redux-syringe/utils';
import { getDisplayName } from '@redux-syringe/utils-react';

import { InjectorDecorator, InjectorHook } from './types';

export const makeDecorator = <
	TInjectable extends Injectable,
	TInjectorStoreInterface extends InjectorStoreInterface<TInjectable, string>
>(
	storeInterface: TInjectorStoreInterface,
	useInjectables: InjectorHook<TInjectable>
): InjectorDecorator<TInjectable> => {
	invariant(storeInterface, 'The store interface is falsy.');

	const { type } = storeInterface;
	const decoratorName = type ? `With${capitalize(type)}` : 'Injector';

	return (injectables, options = {}) =>
		<TProps extends unknown>(NextComponent: ComponentType<TProps>) => {
			const Injector = (props: TProps & Partial<FeatureAndNamespace>) => {
				// eslint-disable-next-line react/destructuring-assignment
				const feature = options.feature ?? props.feature ?? DEFAULT_FEATURE;
				const contextNamespace = useNamespace(feature);
				// eslint-disable-next-line react/destructuring-assignment
				const namespace = options.namespace ?? props.namespace ?? contextNamespace ?? undefined;

				const isInitialized = useInjectables(injectables, {
					...options,
					feature,
					namespace,
				});

				if (isInitialized) {
					return <NextComponent key={String([feature, namespace])} {...props} />;
				}

				return null;
			};

			hoistNonReactStatics(Injector, NextComponent);

			Injector.displayName = `${decoratorName}(${getDisplayName(NextComponent)})`;

			return Injector;
		};
};
