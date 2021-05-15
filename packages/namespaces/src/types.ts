import type { Action } from 'redux';

export type Namespace = string;
export type Feature = string;

export interface FeatureAndNamespace<TFeature extends Feature = Feature> {
	namespace: Namespace;
	feature: TFeature;
}

export type ActionLike = Action | ((...args: any[]) => any);

export type NamespacedActionLike<TAction extends ActionLike = ActionLike> = TAction & {
	meta: { namespace: Namespace };
};
