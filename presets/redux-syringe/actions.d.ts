declare module '@redux-syringe/actions' {
	/**
	 * @deprecated Use different action types instead of relying on an `error` property.
	 */
	export const isErrorAction: (action: any) => action is { error: true };

	/**
	 * @deprecated Use different action types instead of relying on an `error` property.
	 */
	export const isNotErrorAction: (action: any) => boolean;

	/**
	 * @deprecated Use `createAction` from Redux Toolkit.
	 */
	export const configureActionCreator: (...args: any[]) => any;

	/**
	 * @deprecated Use `createAction` from Redux Toolkit.
	 */
	export const makeActionTypes: <S extends string, U extends string>(
		scope: S,
		types: U[]
	) => { [K in U]: `${S}/${K}` };

	/**
	 * @deprecated Use `createAction` from Redux Toolkit.
	 */
	export const makeEmptyActionCreator: <T extends string>(type: T) => () => { type: T };

	/**
	 * @deprecated Use `createAction` from Redux Toolkit.
	 */
	export const makeConstantActionCreator: <T extends string>(type: T) => () => { type: T };

	/**
	 * @deprecated Use `createAction` from Redux Toolkit.
	 */
	export const makePayloadActionCreator: <T extends string>(
		type: T
	) => <P>(payload: P) => { payload: P; type: T };

	/**
	 * @deprecated Use `createAction` from Redux Toolkit.
	 */
	export const makeSimpleActionCreator: <T extends string>(
		type: T
	) => <P>(payload: P) => { payload: P; type: T };

	/**
	 * @deprecated Use `createAction` from Redux Toolkit.
	 */
	export const makePayloadMetaActionCreator: <T extends string>(
		type: T
	) => <P, M extends Record<string, unknown>>(
		payload: P,
		meta: M
	) => { meta: M; payload: P; type: T };
}
