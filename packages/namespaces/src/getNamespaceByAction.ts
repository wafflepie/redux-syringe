import { ActionLike, Namespace, NamespacedActionLike } from './types';

interface GetNamespaceByAction {
	(action: NamespacedActionLike): Namespace;
	(action: ActionLike): Namespace | undefined;
}

/**
 * Returns the namespace of an action.
 */
export const getNamespaceByAction: GetNamespaceByAction = (action: any) => action?.meta?.namespace;
