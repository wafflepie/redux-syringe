import { FeatureAndNamespace } from '@redux-syringe/namespaces';

export type Injectable = (...args: any[]) => any;

export type InjectableKey = string;

export type Injectables<TInjectable extends Injectable = Injectable> =
	| undefined
	| null
	| TInjectable
	| Injectables<TInjectable>[]
	| {
			[injectableKey: string]: Injectables<TInjectable>;
	  };

export interface InjectableEntry<TInjectable extends Injectable = Injectable>
	extends Partial<FeatureAndNamespace> {
	value: TInjectable;
	path: InjectableKey[];
}

export interface InjectorStoreInterface<
	TInjectable extends Injectable,
	TInjectablePluralName extends string
> {
	type: TInjectablePluralName;
	injectionKey: `inject${Capitalize<TInjectablePluralName>}`;
	ejectionKey: `eject${Capitalize<TInjectablePluralName>}`;

	getEntries: (
		store: InjectorStore<TInjectable, InjectorStoreInterface<TInjectable, TInjectablePluralName>>
	) => InjectableEntry<TInjectable>[];

	setEntries: (
		entries: InjectableEntry<TInjectable>[],
		store: InjectorStore<TInjectable, InjectorStoreInterface<TInjectable, TInjectablePluralName>>
	) => void;
}

export type InjectorStoreEntries<
	TInjectable extends Injectable,
	TInjectablePluralName extends string
> = Record<TInjectablePluralName, InjectableEntry<TInjectable>[]>;

export interface InjectorMethod<TInjectable extends Injectable> {
	(injectables: Injectables<TInjectable>, props?: Partial<FeatureAndNamespace>): void;
}

export type InjectorStore<
	TInjectable extends Injectable,
	TInjectorStoreInterface extends InjectorStoreInterface<TInjectable, string>
> = Record<
	TInjectorStoreInterface['injectionKey'] | TInjectorStoreInterface['ejectionKey'],
	InjectorMethod<TInjectable>
> & {
	entries?: InjectorStoreEntries<TInjectable, TInjectorStoreInterface['type']>;
};

export interface InjectorCallbackPayload<TInjectable extends Injectable = Injectable> {
	injectables: Injectables<TInjectable>;
	props: Partial<FeatureAndNamespace>;
	entries: InjectableEntry<TInjectable>[];
}

export interface InjectorCallbacks<TInjectable extends Injectable = Injectable> {
	onEjected?: (payload: InjectorCallbackPayload<TInjectable>) => void;
	onInjected?: (payload: InjectorCallbackPayload<TInjectable>) => void;
}
