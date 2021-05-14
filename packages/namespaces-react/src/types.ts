import { Feature, Namespace } from '@redux-syringe/namespaces';

export type Namespaces = Record<Feature, Namespace>;

export interface UseExternalNamespace {
	(feature: Feature, namespaces: Namespaces): Namespace | undefined | null;
}
