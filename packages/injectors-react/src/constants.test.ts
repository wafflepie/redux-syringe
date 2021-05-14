import * as constants from './constants';

describe('constants', () => {
	it('should not be changed', () => {
		expect(constants).toMatchSnapshot();
	});
});
