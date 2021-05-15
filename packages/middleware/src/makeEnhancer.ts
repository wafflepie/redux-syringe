/* eslint-disable no-use-before-define */
import invariant from 'invariant';
import { map, compose, uniq, forEach, o, identity } from 'ramda';
import type { Middleware, StoreEnhancer, Dispatch, MiddlewareAPI } from 'redux';

import {
	enhanceStore,
	makeStoreInterface,
	InjectableEntry,
	InjectorStore,
} from '@redux-syringe/injectors';
import {
	isActionFromNamespace,
	defaultNamespace,
	getStateByFeatureAndNamespace,
	DEFAULT_FEATURE,
	Feature,
	Namespace,
} from '@redux-syringe/namespaces';

export const storeInterface = makeStoreInterface<Middleware, 'middleware'>('middleware');

const noopEntry: InjectableEntry<Middleware> = {
	path: ['@redux-syringe/NOOP_MIDDLEWARE'],
	value: () => next => action => next(action),
};

export type MiddlewareEnhancer = StoreEnhancer<InjectorStore<Middleware, typeof storeInterface>> & {
	injectedMiddleware: Middleware;
};

export interface InjectableMiddlewareApi<N = any> {
	getNamespacedState: (feature?: Feature) => N | undefined;
	namespace?: Namespace;
}

export type FullInjectableMiddlewareApi<D extends Dispatch = Dispatch, S = any, N = any> =
	MiddlewareAPI<D, S> & Partial<InjectableMiddlewareApi<N>>;

export const makeEnhancer = (): MiddlewareEnhancer => {
	// NOTE: Keys are entries, values are middleware with bound `dispatch` and `getState`.
	let initializedEntries = new Map();

	// NOTE: Sadly, because of how enhancers and middleware are structured, we need some escape hatches
	// from scopes and closures. This is ugly, but I don't think we can solve this differently.
	// NOTE: `outerNext` is either the next middleware in `applyMiddleware` or `store.dispatch`.
	let outerNext: Dispatch<any> | undefined;

	// NOTE: This default implementation is necessary to ensure that the middleware works even without
	// any injected middleware.
	// NOTE `enhancerNext` calls all injected middleware and then `outerNext`.
	let enhancerNext: Dispatch<any> = (action: any) => {
		invariant(outerNext, 'You need to apply the enhancer to a Redux store.');

		return outerNext(action);
	};

	const injectedMiddleware: Middleware = () => next => {
		invariant(!outerNext, 'You cannot apply the injected middleware to multiple Redux stores.');
		outerNext = next;

		return action => enhancerNext(action);
	};

	// NOTE: composeEntries :: [Entry] -> Next
	const composeEntries = (entries: InjectableEntry<Middleware>[]) => {
		const chain = map(entry => {
			const { namespace } = entry;

			// NOTE: `innerNext` is either the next injected middleware or `outerNext`.
			return (innerNext: Dispatch<any>) => {
				// NOTE: `entryNext` is a wrapper over the currently iterated-over injected middleware.
				const entryNext = initializedEntries.get(entry)(innerNext);

				return (action: any) =>
					isActionFromNamespace(namespace, action) ? entryNext(action) : innerNext(action);
			};
		}, entries);

		// NOTE: `compose` is used to preserve injection order.
		return (compose as any)(...chain)(outerNext);
	};

	const enhancer: MiddlewareEnhancer =
		createStore =>
		(...args) => {
			const prevStore = createStore(...args);

			// NOTE: All of this logic is just to achieve the following behaviour:
			// Every middleware is curried. In standard Redux, the first two arguments are bound immediately.
			// However, when injecting the middleware, we are not able to easily provide the second argument
			// immediately, because it changes whenever an entry is injected or ejected. That's why we only
			// bind the first argument and then provide `next` once per any injection call. This behaviour
			// is covered by unit tests, which may help explain this better.
			const handleEntriesChanged = () => {
				const nextEntries = [
					...uniq(storeInterface.getEntries(nextStore)),
					// NOTE: This is just a safeguard, because although `R.compose` is variadic,
					// it still needs at least one function as an argument.
					noopEntry,
				];

				const nextInitializedEntries = new Map();

				// NOTE: We copy all necessary entries because it's simpler/faster than finding what has changed.
				forEach(entry => {
					const { namespace } = entry;
					const { dispatch, getState } = nextStore;

					nextInitializedEntries.set(
						entry,
						initializedEntries.get(entry) ??
							entry.value({
								namespace,
								dispatch: o(
									(action: any) => dispatch(action),
									namespace ? defaultNamespace(namespace) : identity
								),
								getState: nextStore.getState,
								getNamespacedState: (feature?: Feature) =>
									namespace
										? getStateByFeatureAndNamespace(
												feature ?? entry.feature ?? DEFAULT_FEATURE,
												namespace,
												getState()
										  )
										: undefined,
							} as FullInjectableMiddlewareApi)
					);
				}, nextEntries);

				initializedEntries = nextInitializedEntries;
				enhancerNext = composeEntries(nextEntries);
			};

			const nextStore = enhanceStore(prevStore, storeInterface, {
				onInjected: handleEntriesChanged,
				onEjected: handleEntriesChanged,
			});

			return nextStore;
		};

	enhancer.injectedMiddleware = injectedMiddleware;

	return enhancer;
};
