import { composeReducers } from './composeReducers';

describe('composeReducers', () => {
	it('correctly composes reducers', () => {
		const reducer = composeReducers(
			(state, action) => state - action.payload,
			(state, action) => state * action.payload,
			(state, action) => state + action.payload
		);

		expect(reducer(1, { type: 'action', payload: 3 })).toBe(9);
	});
});
