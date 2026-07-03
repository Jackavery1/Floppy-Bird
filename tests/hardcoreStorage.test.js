import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('hardcoreStorage', () => {
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

    it('persiste le mode hardcore', async () => {
        const { loadHardcoreEnabled, saveHardcoreEnabled } =
            await import('../src/hardcoreStorage.js');
        expect(loadHardcoreEnabled()).toBe(false);
        saveHardcoreEnabled(true);
        expect(loadHardcoreEnabled()).toBe(true);
    });

    it('persiste le tutoriel hardcore vu', async () => {
        const { loadHardcoreTutorialSeen, markHardcoreTutorialSeen } =
            await import('../src/hardcoreStorage.js');
        expect(loadHardcoreTutorialSeen()).toBe(false);
        markHardcoreTutorialSeen();
        expect(loadHardcoreTutorialSeen()).toBe(true);
    });
});
