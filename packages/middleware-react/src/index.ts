import type { Middleware } from 'redux';

import { makeHook, makeDecorator } from '@redux-syringe/injectors-react';
import { storeInterface } from '@redux-syringe/middleware';

export const useMiddleware = makeHook<Middleware, typeof storeInterface>(storeInterface);
export const withMiddleware = makeDecorator(storeInterface, useMiddleware);
