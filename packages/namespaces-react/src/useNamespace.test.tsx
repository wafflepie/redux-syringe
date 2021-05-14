import { mount } from 'enzyme';
import { always } from 'ramda';
import React from 'react';

import { DEFAULT_FEATURE } from '@redux-syringe/namespaces';
import { alwaysNull } from '@redux-syringe/utils';

import { NamespaceContext } from './contexts';
import { useNamespace } from './useNamespace';

const Test = ({ children }: { children: () => void }) => {
	children();

	return null;
};

const alwaysFoo = always('foo');

describe('useNamespace', () => {
	it('returns namespace from context', () => {
		let namespace;

		mount(
			<NamespaceContext.Provider value={{ namespaces: { foo: 'bar' }, useNamespace: alwaysFoo }}>
				<Test>
					{() => {
						namespace = useNamespace('foo');
					}}
				</Test>
			</NamespaceContext.Provider>
		);

		expect(namespace).toEqual('bar');
	});

	it('returns namespace from `useNamespace` if context does not contain feature', () => {
		let namespace;

		mount(
			<NamespaceContext.Provider value={{ namespaces: { foo: 'bar' }, useNamespace: alwaysFoo }}>
				<Test>
					{() => {
						namespace = useNamespace('random');
					}}
				</Test>
			</NamespaceContext.Provider>
		);

		expect(namespace).toEqual('foo');
	});

	it('does not fall back to default feature when no namespace could be resolved', () => {
		let namespace;

		mount(
			<NamespaceContext.Provider
				value={{ namespaces: { [DEFAULT_FEATURE]: 'baz' }, useNamespace: alwaysNull }}
			>
				<Test>
					{() => {
						namespace = useNamespace('random');
					}}
				</Test>
			</NamespaceContext.Provider>
		);

		expect(namespace).toBeFalsy();
	});
});
