import { ActionOrThunk, Namespace, NamespacedActionOrThunk } from './types';

interface GetNamespaceByAction {
	(action: NamespacedActionOrThunk): Namespace;
	(action: ActionOrThunk): Namespace | undefined;
}

/**
 * Returns the namespace of an action.
 */
export const getNamespaceByAction: GetNamespaceByAction = (action: any) => action?.meta?.namespace;
