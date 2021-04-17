import { makeHook, makeDecorator } from '@redux-syringe/injectors-react';
import { storeInterface } from '@redux-syringe/middleware';

export const useMiddleware = makeHook(storeInterface);
export const withMiddleware = makeDecorator(storeInterface, useMiddleware);
