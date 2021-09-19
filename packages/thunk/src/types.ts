// NOTE: https://github.com/reduxjs/redux-thunk/blob/master/src/index.d.ts
import type { Action, AnyAction, Middleware } from 'redux';

import { Feature, Namespace } from '@redux-syringe/namespaces';

declare module 'redux' {
	export interface Dispatch<A extends Action = AnyAction> {
		<TReturnValue = any, TState = any, TDependencies extends AnyObject = AnyObject>(
			thunk: Thunk<TReturnValue, TState, TDependencies, A>
		): TReturnValue;
	}
}

export type AnyObject = Record<string, unknown>;

export type Thunk<
	TReturnValue = any,
	TState = any,
	TDependencies extends AnyObject = AnyObject,
	TBasicAction extends Action = AnyAction
> = (
	thunkApi: TDependencies & {
		dispatch: ThunkDispatch<TState, TDependencies, TBasicAction>;
		getNamespacedState: <TNamespacedState = any>(feature?: Feature) => TNamespacedState | undefined;
		getState: () => TState;
		namespace?: Namespace;
	}
) => TReturnValue;

export interface ThunkDispatch<
	TState = any,
	TDependencies extends AnyObject = AnyObject,
	TBasicAction extends Action = AnyAction
> {
	<TReturnValue>(thunk: Thunk<TReturnValue, TState, TDependencies, TBasicAction>): TReturnValue;

	<TAction extends TBasicAction>(action: TAction): TAction;

	<TReturnValue, TAction extends TBasicAction>(
		action: TAction | Thunk<TReturnValue, TState, TDependencies, TBasicAction>
	): TAction | TReturnValue;
}

export type ThunkMiddleware<
	TState = any,
	TBasicAction extends Action = AnyAction,
	TDependencies extends AnyObject = AnyObject
> = Middleware<
	ThunkDispatch<TState, TDependencies, TBasicAction>,
	TState,
	ThunkDispatch<TState, TDependencies, TBasicAction>
>;

export type ThunkMiddlewareWithDependencies = ThunkMiddleware & {
	withDependencies<
		TDependencies extends AnyObject = AnyObject,
		TState = any,
		TBasicAction extends Action = AnyAction
	>(
		dependencies: TDependencies
	): ThunkMiddleware<TState, TBasicAction, TDependencies>;
};
