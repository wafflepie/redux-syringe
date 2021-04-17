import { storeInterface } from '@redux-syringe/epics';
import { makeHook, makeDecorator } from '@redux-syringe/injectors-react';

export const useEpics = makeHook(storeInterface);
export const withEpics = makeDecorator(storeInterface, useEpics);
