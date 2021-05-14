import { noop } from '@redux-syringe/utils';

import { makeStoreInterface } from './makeStoreInterface';
import { InjectorStore } from './types';

const fooEntry = { path: ['foo'], value: noop };

describe('makeStoreInterface', () => {
	const storeInterface = makeStoreInterface<typeof noop, 'noops'>('noops');

	it('creates an object', () => {
		expect(storeInterface).toBeInstanceOf(Object);
	});

	it('passes correct string attributes down', () => {
		expect(storeInterface.type).toBe('noops');
		expect(storeInterface.injectionKey).toBe('injectNoops');
		expect(storeInterface.ejectionKey).toBe('ejectNoops');
	});

	it('passes correct getters down', () => {
		expect(
			storeInterface.getEntries({
				entries: { noops: [fooEntry] },
				injectNoops: noop,
				ejectNoops: noop,
			})
		).toEqual([fooEntry]);

		// @ts-expect-error `entries` should be defined.
		expect(storeInterface.getEntries({})).toEqual([]);
	});

	it('passes correct setters down', () => {
		const storeA: InjectorStore<typeof noop, typeof storeInterface> = {
			injectNoops: noop,
			ejectNoops: noop,
		};

		storeInterface.setEntries([fooEntry], storeA);
		expect(storeA.entries?.noops).toEqual([fooEntry]);

		const storeB: InjectorStore<typeof noop, typeof storeInterface> = {
			injectNoops: noop,
			ejectNoops: noop,
			// @ts-expect-error `otherNoops` should not be allowed as a valid property.
			entries: { otherNoops: ['bar'] },
		};

		storeInterface.setEntries([fooEntry], storeB);
		expect(storeB.entries?.noops).toEqual([fooEntry]);
		// @ts-expect-error `otherNoops` should not be allowed as a valid property.
		expect(storeB.entries.otherNoops).toEqual(['bar']);
	});
});
