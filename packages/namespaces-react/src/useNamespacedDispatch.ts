import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import type { Dispatch } from 'redux';

import {
	defaultNamespace,
	DEFAULT_FEATURE,
	FeatureAndNamespace,
	ActionOrThunk,
} from '@redux-syringe/namespaces';

import { useNamespace } from './useNamespace';

export const useNamespacedDispatch = ({
	feature: optionFeature,
	namespace: optionNamespace,
}: Partial<FeatureAndNamespace> = {}): Dispatch<any> => {
	const dispatch = useDispatch<any>();
	const feature = optionFeature ?? DEFAULT_FEATURE;
	const contextNamespace = useNamespace(feature);
	const namespace = optionNamespace ?? contextNamespace;

	return useCallback(
		(action: ActionOrThunk) => dispatch(namespace ? defaultNamespace(namespace, action) : action),
		[dispatch, namespace]
	);
};
