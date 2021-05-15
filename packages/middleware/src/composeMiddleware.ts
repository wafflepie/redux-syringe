import { map, applyTo, compose } from 'ramda';
import type { Middleware } from 'redux';

export const composeMiddleware =
	(...middleware: Middleware[]): Middleware =>
	reduxApi =>
	next =>
		(compose as any)(...map(applyTo(reduxApi), middleware))(next);
