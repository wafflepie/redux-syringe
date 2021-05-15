import { mergeNamespace } from './mergeNamespace';
import { ActionLike, Namespace, NamespacedActionLike } from './types';

interface DefaultNamespace {
	<TAction extends ActionLike>(
		namespace: Namespace,
		action: TAction
	): NamespacedActionLike<TAction>;

	(namespace: Namespace): <TAction extends ActionLike>(
		action: TAction
	) => NamespacedActionLike<TAction>;
}

/**
 * Associates an action with a namespace unless it is already associated with some namespace.
 */
export const defaultNamespace: DefaultNamespace = mergeNamespace(false) as any;
