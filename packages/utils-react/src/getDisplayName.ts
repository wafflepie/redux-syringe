import { ComponentType } from 'react';

/**
 * Returns the display name of a React component, falling back appropriately.
 */
export const getDisplayName = (component: ComponentType<any> | string): string =>
	(component as any)?.displayName ||
	(component as any)?.name ||
	(typeof component === 'string' && component.length > 0 ? component : undefined) ||
	'Component';
