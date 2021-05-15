import { mergeNamespace } from './mergeNamespace';
import { ActionLike, Namespace, NamespacedActionLike } from './types';

interface AttachNamespace {
	<TAction extends ActionLike>(
		namespace: Namespace,
		action: TAction
	): NamespacedActionLike<TAction>;

	(namespace: Namespace): <TAction extends ActionLike>(
		action: TAction
	) => NamespacedActionLike<TAction>;
}

/**
 * Associates an action with a namespace, overwriting any previous namespace.
 */
export const attachNamespace: AttachNamespace = mergeNamespace(true) as any;
