import { curry } from 'ramda';

import { NAMESPACE_PREVENTED } from './constants';
import { getNamespaceByAction } from './getNamespaceByAction';
import { ActionOrThunk, Namespace } from './types';

interface IsActionFromNamespace {
	(namespace: Namespace | undefined, action: ActionOrThunk): boolean;
	(namespace: Namespace | undefined): (action: ActionOrThunk) => boolean;
}

/**
 * Checks whether an action is from a namespace.
 */
export const isActionFromNamespace: IsActionFromNamespace = curry(
	(namespace: Namespace | undefined, action: ActionOrThunk): boolean => {
		const actionNamespace = getNamespaceByAction(action);

		if (!namespace || !actionNamespace || actionNamespace === NAMESPACE_PREVENTED) {
			return true;
		}

		return namespace === actionNamespace;
	}
);
