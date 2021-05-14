import { isNil, replace, toUpper, unless } from 'ramda';

export const capitalize: <T extends string>(string: T) => Capitalize<T> = unless(
	isNil,
	replace(/^./, toUpper)
) as any;
