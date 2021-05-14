import { pickFunctions } from './pickFunctions';

const functionA = () => 'a';
const functionB = () => 'b';

describe('pickFunctions', () => {
	it('correctly picks only properties which are functions', () => {
		expect(
			pickFunctions({
				a: functionA,
				b: functionB,
				c: 'foo',
				d: 'bar',
			})
		).toEqual({
			a: functionA,
			b: functionB,
		});
	});
});
