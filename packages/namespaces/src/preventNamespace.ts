import { NAMESPACE_PREVENTED } from './constants';
import { mergeNamespace } from './mergeNamespace';
import { ActionOrThunk, Namespaced } from './types';

/**
 * Associates an action with a "global" namespace, overwriting any previous namespace.
 */
export const preventNamespace = <TAction extends ActionOrThunk>(
	action: TAction
): Namespaced<TAction> => mergeNamespace(true, NAMESPACE_PREVENTED, action);
