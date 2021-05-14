import { equals } from 'ramda';

export const includesTimes = <T>(times: number, item: T, items: T[]): boolean =>
	items.filter(equals(item)).length === times;
