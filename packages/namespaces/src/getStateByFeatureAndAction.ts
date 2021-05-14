import { curry } from 'ramda';

import { getNamespaceByAction } from './getNamespaceByAction';
import { getStateByFeatureAndNamespace } from './getStateByFeatureAndNamespace';
import { Namespace, ActionOrThunk, Feature, NamespacedActionOrThunk } from './types';

interface GetStateByFeatureAndAction {
	<TFeature extends Feature, TNamespacedState>(
		feature: TFeature,
		action: NamespacedActionOrThunk,
		state: Record<TFeature, Record<Namespace, TNamespacedState>>
	): TNamespacedState | undefined;

	<TFeature extends Feature>(feature: TFeature, action: NamespacedActionOrThunk): <
		TNamespacedState
	>(
		state: Record<TFeature, Record<Namespace, TNamespacedState>>
	) => TNamespacedState | undefined;

	<TFeature extends Feature>(feature: TFeature): {
		<TNamespacedState>(
			action: NamespacedActionOrThunk,
			state: Record<TFeature, Record<Namespace, TNamespacedState>>
		): TNamespacedState | undefined;
		(action: NamespacedActionOrThunk): <TNamespacedState>(
			state: Record<TFeature, Record<Namespace, TNamespacedState>>
		) => TNamespacedState | undefined;
	};
}

/**
 * Returns Redux state by feature and action namespace.
 */
export const getStateByFeatureAndAction: GetStateByFeatureAndAction = curry(
	(feature: Feature, action: ActionOrThunk, state) => {
		const namespace = getNamespaceByAction(action);

		if (typeof namespace === 'undefined') {
			return undefined;
		}

		return getStateByFeatureAndNamespace(feature, namespace, state);
	}
);
