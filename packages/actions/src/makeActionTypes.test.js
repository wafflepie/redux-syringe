import makeActionTypes from './makeActionTypes';

describe('makeActionTypes', () => {
	it('correctly transforms an array', () => {
		expect(makeActionTypes('yo', ['HI'])).toEqual({ HI: 'yo/HI' });
	});
});
