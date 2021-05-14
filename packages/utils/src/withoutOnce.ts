import { remove, indexOf, reduce } from 'ramda';

export const withoutOnce = <T>(itemsToRemove: readonly T[], removableItems: readonly T[]): T[] =>
	reduce<T, readonly T[]>(
		(itemAccumulator, itemToRemove) =>
			remove(indexOf(itemToRemove, itemAccumulator), 1, itemAccumulator),
		removableItems,
		itemsToRemove
	) as T[];
