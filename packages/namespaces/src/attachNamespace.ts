import { mergeNamespace } from './mergeNamespace';
import { ActionOrThunk, Namespace, Namespaced } from './types';

interface AttachNamespace {
	<TAction extends ActionOrThunk>(namespace: Namespace, action: TAction): Namespaced<TAction>;

	(namespace: Namespace): <TAction extends ActionOrThunk>(action: TAction) => Namespaced<TAction>;
}

/**
 * Associates an action with a namespace, overwriting any previous namespace.
 */
export const attachNamespace: AttachNamespace = mergeNamespace(true) as any;
