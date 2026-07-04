import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('boolStorage', () => {
    let store;

    beforeEach(() => {
        store = {};
        vi.stubGlobal('localStorage', {
            getItem: (k) => store[k] ?? null,
            setItem: (k, v) => {
                store[k] = v;
            },
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('loadBoolFlag lit les drapeaux 1/0', async () => {
        const { loadBoolFlag, saveBoolFlag } = await import('../src/boolStorage.js');
        saveBoolFlag('test-flag', true);
        expect(loadBoolFlag('test-flag')).toBe(true);
        saveBoolFlag('test-flag', false);
        expect(loadBoolFlag('test-flag')).toBe(false);
    });
});
