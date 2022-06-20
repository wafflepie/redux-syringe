import { ComponentType } from 'react';

import { Injectables, Injectable } from '@redux-syringe/injectors';
import { FeatureAndNamespace } from '@redux-syringe/namespaces';

export interface InjectorOptions extends Partial<FeatureAndNamespace> {
	/**
	 * @deprecated Prefer `isGlobal`.
	 */
	global?: boolean;
	isGlobal?: boolean;
	isNamespaced?: boolean;
	isPersistent?: boolean;
	/**
	 * @deprecated Prefer `isPersistent`.
	 */
	persist?: boolean;
}

export interface InjectorHook<TInjectable extends Injectable> {
	(injectables: Injectables<TInjectable>, options?: InjectorOptions): boolean;
}

export interface InjectorDecorator<TInjectable extends Injectable> {
	(injectables: Injectables<TInjectable>, options?: InjectorOptions): <TProps>(
		NextComponent: ComponentType<TProps>
	) => ComponentType<TProps & Partial<FeatureAndNamespace>>;
}
