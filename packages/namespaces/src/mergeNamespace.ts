import { curry, isNil } from 'ramda';

import { getNamespaceByAction } from './getNamespaceByAction';
import { ActionOrThunk, AnyActionOrThunk, Namespace, Namespaced } from './types';

interface MergeNamespace {
	<TAction extends ActionOrThunk>(
		overwrite: boolean,
		namespace: Namespace,
		action: TAction
	): Namespaced<TAction>;

	(overwrite: boolean, namespace: Namespace): <TAction extends ActionOrThunk>(
		action: TAction
	) => Namespaced<TAction>;

	(overwrite: boolean): {
		<TAction extends ActionOrThunk>(namespace: Namespace, action: TAction): Namespaced<TAction>;
		(namespace: Namespace): <TAction extends ActionOrThunk>(action: TAction) => Namespaced<TAction>;
	};
}

export const mergeNamespace: MergeNamespace = curry(
	(overwrite: boolean, namespace: Namespace, action: AnyActionOrThunk) => {
		if (isNil(namespace)) {
			return action;
		}

		const nextNamespace = overwrite ? namespace : getNamespaceByAction(action) ?? namespace;

		if (typeof action === 'function') {
			const nextAction: Namespaced<ActionOrThunk> = (...args) => action(...args);

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
