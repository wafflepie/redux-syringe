import { Feature, Namespace } from '@redux-syringe/namespaces';

export type NamespacesByFeature = Record<Feature, Namespace>;

export interface UseExternalNamespace {
	(feature: Feature, namespaces: NamespacesByFeature): Namespace | undefined | null;
}
