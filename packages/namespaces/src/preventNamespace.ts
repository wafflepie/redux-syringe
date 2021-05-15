import { NAMESPACE_PREVENTED } from './constants';
import { mergeNamespace } from './mergeNamespace';
import { ActionLike, NamespacedActionLike } from './types';

/**
 * Associates an action with a "global" namespace, overwriting any previous namespace.
 */
export const preventNamespace = <TAction extends ActionLike>(
	action: TAction
): NamespacedActionLike<TAction> => mergeNamespace(true, NAMESPACE_PREVENTED, action);
