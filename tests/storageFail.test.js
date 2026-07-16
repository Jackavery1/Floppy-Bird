import { describe, it, expect, beforeEach } from 'vitest';
import { noteStorageWriteFailure, consumeStorageWriteFailure } from '../src/storageFail.js';

describe('storageFail', () => {
    beforeEach(() => {
        while (consumeStorageWriteFailure()) {
            /* drain */
        }
    });

    it('consume retourne false sans échec', () => {
        expect(consumeStorageWriteFailure()).toBe(false);
    });

    it('note puis consume une seule fois', () => {
        noteStorageWriteFailure();
        expect(consumeStorageWriteFailure()).toBe(true);
        expect(consumeStorageWriteFailure()).toBe(false);
    });
});
