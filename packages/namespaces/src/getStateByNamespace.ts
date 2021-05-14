import { DEFAULT_FEATURE } from './constants';
import { getStateByFeatureAndNamespace } from './getStateByFeatureAndNamespace';

/**
 * Returns Redux state by namespace.
 */
export const getStateByNamespace = getStateByFeatureAndNamespace(DEFAULT_FEATURE);
