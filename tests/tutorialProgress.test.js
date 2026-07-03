import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('tutorialProgress', () => {
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

    it('onTutorialJump avance vers l’étape gap', async () => {
        const { onTutorialJump } = await import('../src/tutorialProgress.js');
        const showGapTutorial = vi.fn();
        const dismissGameplayTutorial = vi.fn();
        const scene = {
            ui: { showGapTutorial, dismissGameplayTutorial },
        };
        onTutorialJump(scene);
        expect(dismissGameplayTutorial).toHaveBeenCalled();
        expect(showGapTutorial).toHaveBeenCalled();
        const { loadTutorialProgress } = await import('../src/tutorialStorage.js');
        expect(loadTutorialProgress()).toBe(1);
    });

    it('showTutorialForProgress affiche le gap si étape 1', async () => {
        const { setTutorialProgress } = await import('../src/tutorialStorage.js');
        const { showTutorialForProgress } = await import('../src/tutorialProgress.js');
        setTutorialProgress(1);
        const showGapTutorial = vi.fn();
        showTutorialForProgress({ ui: { showGapTutorial, showJumpTutorial: vi.fn() } });
        expect(showGapTutorial).toHaveBeenCalled();
    });
});
