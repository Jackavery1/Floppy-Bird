import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('tutorialStorage', () => {
    let store;

    beforeEach(() => {
        store = {};
        vi.stubGlobal('localStorage', {
            getItem: (k) => store[k] ?? null,
            setItem: (k, v) => {
                store[k] = v;
            },
            removeItem: (k) => {
                delete store[k];
            },
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('marque le tutoriel comme vu (compat legacy)', async () => {
        const { loadTutorialSeen, markTutorialSeen, loadTutorialProgress } =
            await import('../src/tutorialStorage.js');
        expect(loadTutorialSeen()).toBe(false);
        markTutorialSeen();
        expect(loadTutorialSeen()).toBe(true);
        expect(loadTutorialProgress()).toBe(3);
    });

    it('progression par étapes', async () => {
        const { loadTutorialProgress, setTutorialProgress, loadTutorialComplete } =
            await import('../src/tutorialStorage.js');
        expect(loadTutorialProgress()).toBe(0);
        setTutorialProgress(1);
        expect(loadTutorialProgress()).toBe(1);
        expect(loadTutorialComplete()).toBe(false);
        setTutorialProgress(3);
        expect(loadTutorialComplete()).toBe(true);
    });

    it('migre tutorialSeen vers progression complète', async () => {
        store['flappy-bird-tutorial-seen'] = '1';
        const { loadTutorialProgress } = await import('../src/tutorialStorage.js');
        expect(loadTutorialProgress()).toBe(3);
    });

    it('hint coyote une seule fois', async () => {
        const { loadCoyoteHintSeen, markCoyoteHintSeen } =
            await import('../src/tutorialStorage.js');
        expect(loadCoyoteHintSeen()).toBe(false);
        markCoyoteHintSeen();
        expect(loadCoyoteHintSeen()).toBe(true);
    });

    it('compte les parties démarrées', async () => {
        const { loadRoundsStarted, incrementRoundsStarted } =
            await import('../src/tutorialStorage.js');
        expect(loadRoundsStarted()).toBe(0);
        expect(incrementRoundsStarted()).toBe(1);
        expect(incrementRoundsStarted()).toBe(2);
        expect(loadRoundsStarted()).toBe(2);
    });

    it('réinitialise le hint coyote tous les 3 morts tuyau', async () => {
        const { recordPipeDeathForCoyoteHint, loadCoyoteHintSeen, markCoyoteHintSeen } =
            await import('../src/tutorialStorage.js');
        markCoyoteHintSeen();
        expect(loadCoyoteHintSeen()).toBe(true);
        recordPipeDeathForCoyoteHint();
        recordPipeDeathForCoyoteHint();
        expect(loadCoyoteHintSeen()).toBe(true);
        recordPipeDeathForCoyoteHint();
        expect(loadCoyoteHintSeen()).toBe(false);
    });
});
