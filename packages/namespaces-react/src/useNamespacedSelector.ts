import { o } from 'ramda';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import {
	getStateByFeatureAndNamespace,
	DEFAULT_FEATURE,
	FeatureAndNamespace,
	Feature,
	Namespace,
} from '@redux-syringe/namespaces';

import { useNamespace } from './useNamespace';

export const useNamespacedSelector = <TNamespacedState = any, TReturnValue = unknown>(
	selector: (state: TNamespacedState | undefined) => TReturnValue,
	equalityFn?: (left: TReturnValue, right: TReturnValue) => boolean,
	{ feature: optionFeature, namespace: optionNamespace }: Partial<FeatureAndNamespace> = {}
): TReturnValue => {
	const feature = optionFeature ?? DEFAULT_FEATURE;
	const contextNamespace = useNamespace(feature);
	const namespace = optionNamespace ?? contextNamespace;

	const namespacedSelector = useMemo(
		() =>
			o(selector, (state: Record<Feature, Record<Namespace, TNamespacedState>>) =>
				namespace ? getStateByFeatureAndNamespace(feature, namespace, state) : undefined
			),
		[selector, feature, namespace]
	);

	return useSelector(namespacedSelector, equalityFn);
};
