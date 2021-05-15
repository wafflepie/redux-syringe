import type { Reducer } from 'redux';

import { makeHook, makeDecorator } from '@redux-syringe/injectors-react';
import { storeInterface } from '@redux-syringe/reducers';

export const useReducers = makeHook<Reducer, typeof storeInterface>(storeInterface);
export const withReducers = makeDecorator(storeInterface, useReducers);
