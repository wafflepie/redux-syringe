import { compose, cond, apply, __, isNil, T, map, o, dissoc } from 'ramda';
import { connect } from 'react-redux';

import {
	defaultNamespace,
	DEFAULT_FEATURE,
	getStateByFeatureAndNamespace,
	FeatureAndNamespace,
} from '@redux-syringe/namespaces';
import { mapProps } from '@redux-syringe/utils-react';

import { useNamespace } from './useNamespace';

export const NAMESPACED_CONNECT_PROPS = 'NAMESPACED_CONNECT_PROPS';

const isFunction = (value: any) => typeof value === 'function';
const isObject = (value: any) => value != null && typeof value === 'object';
const alwaysEmptyObject = () => ({});

export const wrapMapStateToProps: any = (mapStateToProps: any) => (state: any, ownProps: any) =>
	mapStateToProps
		? mapStateToProps(
				getStateByFeatureAndNamespace(
					ownProps[NAMESPACED_CONNECT_PROPS].feature,
					ownProps[NAMESPACED_CONNECT_PROPS].namespace,
					state
				),
				ownProps,
				state
		  )
		: {};

const wrapActionCreator = (wrappedDispatch: any) => (actionCreator: any) =>
	compose(wrappedDispatch, actionCreator);

const throwTypeError = () => {
	throw new TypeError('mapDispatchToProps is not an object or a function');
};

export const wrapMapDispatchToProps: any =
	(mapDispatchToProps: any) => (dispatch: any, ownProps: any) => {
		const wrappedDispatch = o(
			dispatch,
			defaultNamespace(ownProps[NAMESPACED_CONNECT_PROPS].namespace)
		);

		return cond([
			[isNil, alwaysEmptyObject],
			[isFunction, apply(__ as any, [wrappedDispatch, ownProps])],
			[isObject, map(wrapActionCreator(wrappedDispatch))],
			[T, throwTypeError],
		])(mapDispatchToProps);
	};

const rawNamespacedConnect = (
	mapStateToProps: any,
	mapDispatchToProps: any,
	mergeProps: any,
	options: any
): any =>
	connect(
		wrapMapStateToProps(mapStateToProps),
		wrapMapDispatchToProps(mapDispatchToProps),
		mergeProps,
		options
	);

/**
 * @deprecated Prefer `useNamespacedSelector` and `useNamespacedDispatch`.
 */
export const namespacedConnect: any = (
	mapStateToProps: any,
	mapDispatchToProps: any,
	mergeProps: any,
	{
		feature: optionFeature,
		namespace: optionNamespace,
		...options
	}: Partial<FeatureAndNamespace> = {}
) =>
	compose(
		mapProps((props: Partial<FeatureAndNamespace>) => {
			const { feature: propFeature, namespace: propNamespace } = props;
			const feature = optionFeature ?? propFeature ?? DEFAULT_FEATURE;
			const contextNamespace = useNamespace(feature);

			return {
				...props,
				[NAMESPACED_CONNECT_PROPS]: {
					feature,
					namespace: optionNamespace ?? propNamespace ?? contextNamespace,
				},
			};
		}),
		rawNamespacedConnect(mapStateToProps, mapDispatchToProps, mergeProps, options) as any,
		mapProps(dissoc(NAMESPACED_CONNECT_PROPS))
	);
