import { mergeNamespace } from './mergeNamespace';
import { ActionOrThunk, Namespace, Namespaced } from './types';

interface DefaultNamespace {
	<TAction extends ActionOrThunk>(namespace: Namespace, action: TAction): Namespaced<TAction>;

	(namespace: Namespace): <TAction extends ActionOrThunk>(action: TAction) => Namespaced<TAction>;
}

/**
 * Associates an action with a namespace unless it is already associated with some namespace.
 */
export const defaultNamespace: DefaultNamespace = mergeNamespace(false) as any;
