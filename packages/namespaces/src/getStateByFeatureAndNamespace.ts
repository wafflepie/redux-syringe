import { curry, path } from 'ramda';

import { Feature, Namespace } from './types';

interface GetStateByFeatureAndNamespace {
	<TFeature extends Feature, TNamespacedState>(
		feature: TFeature,
		namespace: Namespace,
		state: Record<TFeature, Record<Namespace, TNamespacedState>>
	): TNamespacedState | undefined;

	<TFeature extends Feature>(feature: TFeature, namespace: Namespace): <TNamespacedState>(
		state: Record<TFeature, Record<Namespace, TNamespacedState>>
	) => TNamespacedState | undefined;

	<TFeature extends Feature>(feature: TFeature): {
		<TNamespacedState>(
			namespace: Namespace,
			state: Record<TFeature, Record<Namespace, TNamespacedState>>
		): TNamespacedState | undefined;
		(namespace: Namespace): <TNamespacedState>(
			state: Record<TFeature, Record<Namespace, TNamespacedState>>
		) => TNamespacedState | undefined;
	};
}

/**
 * Returns Redux state by feature and namespace.
 */
export const getStateByFeatureAndNamespace: GetStateByFeatureAndNamespace = curry(
	(feature: Feature, namespace: Namespace, state) => path([feature, namespace], state)
);
