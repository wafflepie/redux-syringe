/* eslint-disable no-use-before-define */
import { equals, identity, includes } from 'ramda';
import type { Action, StoreEnhancer } from 'redux';
import type { Epic, EpicMiddleware, StateObservable } from 'redux-observable';
import { Observable, Subject } from 'rxjs';
import * as Rx from 'rxjs/operators';

import {
	enhanceStore,
	makeStoreInterface,
	InjectorStore,
	InjectableEntry,
} from '@redux-syringe/injectors';
import { isActionFromNamespace, defaultNamespace } from '@redux-syringe/namespaces';
import { includesTimes } from '@redux-syringe/utils';

export const storeInterface = makeStoreInterface<Epic, 'epics'>('epics');

export type EpicsEnhancer = StoreEnhancer<InjectorStore<Epic, typeof storeInterface>>;

export interface EpicsEnhancerOptions {
	epicMiddleware: EpicMiddleware<any>;
	streamCreator?: StreamCreator;
}

export interface StreamCreator {
	(
		props: Omit<InjectableEntry, 'value'> & {
			action$: Observable<any>;
			globalAction$: Observable<any>;
			state$: StateObservable<any>;
		}
	): any;
}

export const makeEnhancer =
	({ epicMiddleware, streamCreator }: EpicsEnhancerOptions): EpicsEnhancer =>
	createStore =>
	(...args) => {
		const prevStore = createStore(...args);

		const injectedEntries$ = new Subject<InjectableEntry[]>();
		const ejectedEntries$ = new Subject<InjectableEntry[]>();

		const rootEpic = (
			globalAction$: Observable<any>,
			state$: StateObservable<any>,
			dependencies: any
		) =>
			injectedEntries$.pipe(
				Rx.mergeAll(),
				Rx.filter(injectedEntry =>
					includesTimes(1, injectedEntry, storeInterface.getEntries(nextStore))
				),
				Rx.mergeMap(injectedEntry => {
					const { value: epic, namespace, ...otherProps } = injectedEntry;
					const action$ = globalAction$.pipe(Rx.filter(isActionFromNamespace(namespace)));

					const outputAction$ = streamCreator
						? epic(
								action$,
								state$,
								streamCreator({ namespace, action$, globalAction$, state$, ...otherProps }),
								dependencies
						  )
						: epic(action$, state$, dependencies);

					return outputAction$.pipe(
						Rx.map<Action, Action>(namespace ? defaultNamespace(namespace) : identity),
						// NOTE: takeUntil should ALWAYS be the last operator in `.pipe()`
						// https://blog.angularindepth.com/rxjs-avoiding-takeuntil-leaks-fb5182d047ef
						Rx.takeUntil(
							ejectedEntries$.pipe(
								Rx.mergeAll(),
								Rx.filter(equals(injectedEntry)),
								Rx.filter(
									ejectedEntry => !includes(ejectedEntry, storeInterface.getEntries(nextStore))
								)
							)
						)
					);
				})
			);

		epicMiddleware.run(rootEpic);

		const nextStore = enhanceStore(prevStore, storeInterface, {
			onInjected: ({ entries }) => injectedEntries$.next(entries),
			onEjected: ({ entries }) => ejectedEntries$.next(entries),
		});

		return nextStore;
	};
