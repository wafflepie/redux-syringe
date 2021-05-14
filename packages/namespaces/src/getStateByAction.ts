import { DEFAULT_FEATURE } from './constants';
import { getStateByFeatureAndAction } from './getStateByFeatureAndAction';

/**
 * Returns Redux state by action namespace.
 */
export const getStateByAction = getStateByFeatureAndAction(DEFAULT_FEATURE);
