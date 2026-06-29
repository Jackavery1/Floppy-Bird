import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('tutorialStorage', () => {
    let store;

    beforeEach(() => {
        store = {};
        vi.stubGlobal('localStorage', {
            getItem: (k) => store[k] ?? null,
            setItem: (k, v) => { store[k] = v; },
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('marque le tutoriel comme vu', async () => {
        const { loadTutorialSeen, markTutorialSeen } = await import('../src/tutorialStorage.js');
        expect(loadTutorialSeen()).toBe(false);
        markTutorialSeen();
        expect(loadTutorialSeen()).toBe(true);
    });
});
