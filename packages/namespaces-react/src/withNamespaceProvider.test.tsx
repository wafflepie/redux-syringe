import { mount } from 'enzyme';
import React from 'react';

import { alwaysNull } from '@redux-syringe/utils';

import { NamespaceContext, NamespaceContextValue } from './contexts';
import { withNamespaceProvider } from './withNamespaceProvider';

describe('withNamespaceProvider', () => {
	beforeEach(() => jest.resetAllMocks());

	it('configures NamespaceContext with options having priority over props', () => {
		const Test = withNamespaceProvider({ namespace: 'foo' })(NamespaceContext.Consumer);
		const renderProp = jest.fn<null, [NamespaceContextValue]>(alwaysNull);

		mount(
			<Test namespace="bar" feature="bar">
				{renderProp}
			</Test>
		);

		expect(renderProp).toHaveBeenCalledWith({
			isUseNamespaceProvided: false,
			namespaces: { bar: 'foo' },
			useNamespace: alwaysNull,
		});
	});
});
