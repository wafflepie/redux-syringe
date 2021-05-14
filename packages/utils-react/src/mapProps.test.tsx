import { shallow } from 'enzyme';
import React from 'react';

import { alwaysNull } from '@redux-syringe/utils';

import { mapProps } from './mapProps';

interface FooProps {
	foo: string;
}

describe('mapProps', () => {
	it('accepts a function', () => {
		const Component = mapProps(({ foo }: FooProps) => ({ foo: foo.toUpperCase() }))(alwaysNull);
		const wrapper = shallow(<Component foo="bar" />);
		expect(wrapper.find(alwaysNull).prop('foo')).toBe('BAR');
	});

	it('does not preserve existing props', () => {
		const Component = mapProps(({ foo }: FooProps) => ({ foo: foo.toUpperCase() }))(alwaysNull);
		// @ts-expect-error `bar` shouldn't be allowed as a valid prop name.
		const wrapper = shallow(<Component foo="bar" bar="baz" />);
		expect(wrapper.find(alwaysNull).prop('foo')).toBe('BAR');
		expect(wrapper.find(alwaysNull).prop('bar')).toBeUndefined();
	});
});
