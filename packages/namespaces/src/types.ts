import type { Action, AnyAction } from 'redux';

export type Namespace = string;
export type Feature = string;

export interface FeatureAndNamespace<TFeature extends Feature = Feature> {
	namespace: Namespace;
	feature: TFeature;
}

export type ActionOrThunk = Action | ((...args: any[]) => any);
export type AnyActionOrThunk = AnyAction | ((...args: any[]) => any);

export type Namespaced<TAction> = TAction & { meta: { namespace: Namespace } };
export type NamespacedActionOrThunk = Namespaced<ActionOrThunk>;
