import { curry, isNil } from 'ramda';
import type { AnyAction } from 'redux';

import { getNamespaceByAction } from './getNamespaceByAction';
import { ActionLike, Namespace, NamespacedActionLike } from './types';

interface MergeNamespace {
	<TAction extends ActionLike>(
		overwrite: boolean,
		namespace: Namespace,
		action: TAction
	): NamespacedActionLike<TAction>;

	(overwrite: boolean, namespace: Namespace): <TAction extends ActionLike>(
		action: TAction
	) => NamespacedActionLike<TAction>;

	(overwrite: boolean): {
		<TAction extends ActionLike>(
			namespace: Namespace,
			action: TAction
		): NamespacedActionLike<TAction>;
		(namespace: Namespace): <TAction extends ActionLike>(
			action: TAction
		) => NamespacedActionLike<TAction>;
	};
}

type AnyActionLike = AnyAction | ((...args: any[]) => any);

export const mergeNamespace: MergeNamespace = curry(
	(overwrite: boolean, namespace: Namespace, action: AnyActionLike) => {
		if (isNil(namespace)) {
			return action;
		}

		const nextNamespace = overwrite ? namespace : getNamespaceByAction(action) ?? namespace;

		if (typeof action === 'function') {
			const nextAction: NamespacedActionLike<ActionLike> = (...args) => action(...args);

			nextAction.meta = {
				namespace: nextNamespace,
			};

			return nextAction;
		}

		return {
			...action,
			meta: {
				...action.meta,
				namespace: nextNamespace,
			},
		};
	}
);
