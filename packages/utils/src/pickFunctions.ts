import { pickBy } from 'ramda';

type PickFunctions<T> = {
	[K in keyof T as T[K] extends (...args: any[]) => any ? K : never]: T[K];
};

export const pickFunctions: <T>(object: T) => PickFunctions<T> = pickBy(
	value => typeof value === 'function'
);
