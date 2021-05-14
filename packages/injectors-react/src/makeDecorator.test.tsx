import { mount } from 'enzyme';
import { identity } from 'ramda';
import React from 'react';
import { createStore } from 'redux';

import { makeStoreInterface } from '@redux-syringe/injectors';
import { NamespaceProvider } from '@redux-syringe/namespaces-react';
import { alwaysNull } from '@redux-syringe/utils';

import { makeDecorator } from './makeDecorator';
import { makeHook } from './makeHook';

const storeInterface = makeStoreInterface('things');
const useThings = makeHook(storeInterface);
const withThings = makeDecorator(storeInterface, useThings);

jest.mock('./constants', () => ({ IS_SERVER: false }));

describe('makeDecorator', () => {
	const store = {
		...createStore(identity),
		injectThings: jest.fn(),
		ejectThings: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('calls proper store methods when mounted', () => {
		const Root = withThings({ foo: alwaysNull })(alwaysNull);

		mount(
			<NamespaceProvider store={store} namespace="yolo">
				<Root />
			</NamespaceProvider>
		);

		expect(store.injectThings).toHaveBeenCalledTimes(1);
		expect(store.injectThings.mock.calls[0][0]).toEqual({ foo: alwaysNull });
	});
});
