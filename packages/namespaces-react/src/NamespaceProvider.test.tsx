import { mount } from 'enzyme';
import { always, identity } from 'ramda';
import React from 'react';
import { ReactReduxContext } from 'react-redux';
import { createStore } from 'redux';

import { DEFAULT_FEATURE } from '@redux-syringe/namespaces';
import { alwaysNull } from '@redux-syringe/utils';

import { NamespaceProvider } from './NamespaceProvider';
import { NamespaceContext } from './contexts';

describe('NamespaceProvider', () => {
	const store = createStore(identity);
	const renderProp = jest.fn(alwaysNull);
	const alwaysFoo = always('foo');

	beforeEach(() => jest.resetAllMocks());

	it('passes props to NamespaceContext correctly', () => {
		mount(
			<NamespaceProvider namespace="ns" useNamespace={alwaysFoo}>
				<NamespaceContext.Consumer>{renderProp}</NamespaceContext.Consumer>
			</NamespaceProvider>
		);

		expect(renderProp).toHaveBeenCalledWith({
			namespaces: { [DEFAULT_FEATURE]: 'ns' },
			useNamespace: alwaysFoo,
			isUseNamespaceProvided: true,
		});
	});

	it('allows seamless nesting', () => {
		mount(
			<NamespaceProvider namespace="ns">
				<NamespaceProvider useNamespace={alwaysFoo}>
					<NamespaceProvider namespace="yo">
						<NamespaceContext.Consumer>{renderProp}</NamespaceContext.Consumer>
					</NamespaceProvider>
				</NamespaceProvider>
			</NamespaceProvider>
		);

		expect(renderProp).toHaveBeenCalledWith({
			namespaces: { [DEFAULT_FEATURE]: 'yo' },
			useNamespace: alwaysFoo,
			isUseNamespaceProvided: true,
		});
	});

	it('allows seamless nesting with features', () => {
		mount(
			<NamespaceProvider namespace="ns" feature="grids">
				<NamespaceProvider useNamespace={alwaysFoo}>
					<NamespaceProvider namespace="yo">
						<NamespaceContext.Consumer>{renderProp}</NamespaceContext.Consumer>
					</NamespaceProvider>
				</NamespaceProvider>
			</NamespaceProvider>
		);

		expect(renderProp).toHaveBeenCalledWith({
			namespaces: { [DEFAULT_FEATURE]: 'yo', grids: 'ns' },
			useNamespace: alwaysFoo,
			isUseNamespaceProvided: true,
		});
	});

	it('uses a react-redux provider if store is passed', () => {
		mount(
			<NamespaceProvider store={store}>
				<ReactReduxContext.Consumer>{renderProp}</ReactReduxContext.Consumer>
			</NamespaceProvider>
		);

		expect((renderProp.mock.calls as any)[0][0].store).toBe(store);
	});

	it('defaults isUseNamespaceProvided to false', () => {
		mount(
			<NamespaceProvider namespace="ns" feature="grids">
				<NamespaceProvider namespace="yo">
					<NamespaceContext.Consumer>{renderProp}</NamespaceContext.Consumer>
				</NamespaceProvider>
			</NamespaceProvider>
		);

		expect(renderProp).toHaveBeenCalledWith({
			namespaces: { [DEFAULT_FEATURE]: 'yo', grids: 'ns' },
			useNamespace: alwaysNull,
			isUseNamespaceProvided: false,
		});
	});
});
