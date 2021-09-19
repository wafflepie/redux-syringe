import { thunkMiddleware } from './thunkMiddleware';

export type {
	Thunk,
	ThunkDispatch,
	ThunkMiddleware,
	ThunkMiddlewareWithDependencies,
} from './types';

export { thunkMiddleware };
export default thunkMiddleware;
