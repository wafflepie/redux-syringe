import { makeHook, makeDecorator } from '@redux-syringe/injectors-react';
import { storeInterface } from '@redux-syringe/reducers';

export const useReducers = makeHook(storeInterface);
export const withReducers = makeDecorator(storeInterface, useReducers);
