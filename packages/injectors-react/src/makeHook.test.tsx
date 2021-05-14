import { mount } from 'enzyme';
import { always, identity } from 'ramda';
import React from 'react';
import { createStore } from 'redux';

import { makeStoreInterface } from '@redux-syringe/injectors';
import { NamespaceProvider } from '@redux-syringe/namespaces-react';
import { noop } from '@redux-syringe/utils';

import { makeHook } from './makeHook';

const storeInterface = makeStoreInterface('things');
const useThings = makeHook(storeInterface);

jest.mock('./constants', () => ({ IS_SERVER: false }));

const injectables = { foo: noop };

const Test = ({ children }: { children: () => void }) => {
	children();

	return null;
};

describe('makeHook', () => {
	const store = {
		...createStore(identity),
		injectThings: jest.fn(),
		ejectThings: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('calls proper store methods', () => {
		mount(
			<NamespaceProvider store={store} namespace="yolo">
				<Test>{() => useThings(injectables)}</Test>
			</NamespaceProvider>
		);

		expect(store.injectThings).toHaveBeenCalledTimes(1);
		expect(store.injectThings.mock.calls[0][0]).toEqual({ foo: noop });
	});

	it('warns if useNamespace is provided, but the namespace could not be resolved and isGlobal is not passed', () => {
		const warn = jest.spyOn(global.console, 'warn').mockImplementation(noop);

		mount(
			<NamespaceProvider store={store} useNamespace={always(undefined)}>
				<Test>{() => useThings(injectables)}</Test>
			</NamespaceProvider>
		);

		expect(warn).toHaveBeenCalled();
	});

	it('does not warn if namespace is missing and isGlobal is not passed', () => {
		const warn = jest.spyOn(global.console, 'warn');

		mount(
			<NamespaceProvider store={store}>
				<Test>{() => useThings(injectables)}</Test>
			</NamespaceProvider>
		);

		expect(warn).toHaveBeenCalledTimes(0);
	});

	it('does not warn if namespace is passed and isGlobal is not passed', () => {
		const warn = jest.spyOn(global.console, 'warn');

		mount(
			<NamespaceProvider store={store} namespace="yolo">
				<Test>{() => useThings(injectables)}</Test>
			</NamespaceProvider>
		);

		expect(warn).toHaveBeenCalledTimes(0);
	});

	it('throws if isNamespaced is passed, but no namespace could be resolved', () => {
		jest.spyOn(global.console, 'error').mockImplementation(noop);

		expect(() => {
			mount(
				<NamespaceProvider store={store}>
					<Test>{() => useThings(injectables, { isNamespaced: true })}</Test>
				</NamespaceProvider>
			);
		}).toThrowError(
			"You're injecting things marked as namespaced, but no namespace could be resolved."
		);
	});
});
