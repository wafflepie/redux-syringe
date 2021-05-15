import type { Epic } from 'redux-observable';

import { storeInterface } from '@redux-syringe/epics';
import { makeHook, makeDecorator } from '@redux-syringe/injectors-react';

export const useEpics = makeHook<Epic, typeof storeInterface>(storeInterface);
export const withEpics = makeDecorator(storeInterface, useEpics);
