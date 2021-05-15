import {
	prop,
	compose,
	useWith,
	__,
	defaultTo,
	identity,
	cond,
	map,
	append,
	T,
	includes,
	over,
	lensIndex,
} from 'ramda';

const isFunction = (value: any) => typeof value === 'function';
const isString = (value: any) => typeof value === 'string';
const overHead = over(lensIndex(0));

const createTypeEqualsPredicate = (condition: any) => (state: any, action: any) => {
	if (isString(condition)) {
		return action.type === condition;
	}

	if (Array.isArray(condition)) {
		return includes(action.type, condition);
	}

	if (isFunction(condition)) {
		return condition(action);
	}

	throw new TypeError(
		'The condition passed to makeReducer must be a string, an array of strings, or a predicate. ' +
			'Instead, it received ' +
			condition +
			'.'
	);
};

const mergeReducers = ([typePredicate, reducer, errorReducer]: any) => {
	const newReducer = (state: any, action: any) => {
		if (prop('error', action) && errorReducer) {
			return errorReducer(state, action);
		}

		return reducer(state, action);
	};

	return [typePredicate, newReducer];
};

/**
 * @deprecated Use `createReducer` from Redux Toolkit.
 */
export const makeReducer: any = (tuples: any, initialState: any): any =>
	(compose as any)(
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useWith(__ as any, [defaultTo(initialState), identity]),
		cond,
		map(mergeReducers),
		append([T, identity, identity]),
		map((overHead as any)(createTypeEqualsPredicate))
	)(tuples);
