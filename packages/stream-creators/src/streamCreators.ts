import { prop } from 'ramda';
import { map } from 'rxjs/operators';

import { StreamCreator } from '@redux-syringe/epics';
import { DEFAULT_FEATURE, getStateByFeatureAndNamespace } from '@redux-syringe/namespaces';

/**
 * Stream creator to pass as `streamCreator` to the enhancer. Adds a `namespacedState$` argument
 * to each epic, allowing access to state based on the namespace of the epic.
 */
export const namespacedState$: StreamCreator = ({ feature, namespace, state$ }) =>
	state$.pipe(
		map(state =>
			namespace
				? getStateByFeatureAndNamespace(feature ?? DEFAULT_FEATURE, namespace, state)
				: state
		)
	);

/**
 * Stream creator to pass as `streamCreator` to the enhancer. Adds a `globalAction$` argument
 * to each epic, allowing access to actions of all namespaces, not just the epic's.
 */
export const globalAction$: StreamCreator = prop('globalAction$');
