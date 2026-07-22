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

    it('showHardcoreTutorialIfNeeded affiche le tutoriel hardcore une fois', async () => {
        const { setTutorialProgress } = await import('../src/tutorialStorage.js');
        const { showHardcoreTutorialIfNeeded } = await import('../src/tutorialProgress.js');
        setTutorialProgress(3);
        const showHardcoreTutorial = vi.fn();
        const scene = { hardcoreMode: true, ui: { showHardcoreTutorial } };
        showHardcoreTutorialIfNeeded(scene);
        expect(showHardcoreTutorial).toHaveBeenCalled();
        showHardcoreTutorial.mockClear();
        showHardcoreTutorialIfNeeded(scene);
        expect(showHardcoreTutorial).not.toHaveBeenCalled();
    });

    it('showTutorialForProgress skip après 3 parties', async () => {
        const { incrementRoundsStarted } = await import('../src/tutorialStorage.js');
        const { showTutorialForProgress } = await import('../src/tutorialProgress.js');
        incrementRoundsStarted();
        incrementRoundsStarted();
        incrementRoundsStarted();
        const showJumpTutorial = vi.fn();
        showTutorialForProgress({ ui: { showJumpTutorial, showGapTutorial: vi.fn() } });
        expect(showJumpTutorial).not.toHaveBeenCalled();
        const { loadTutorialComplete } = await import('../src/tutorialStorage.js');
        expect(loadTutorialComplete()).toBe(true);
    });

    it('skipTutorial marque le tutoriel terminé', async () => {
        const { skipTutorial } = await import('../src/tutorialProgress.js');
        const dismissGameplayTutorial = vi.fn();
        skipTutorial({ ui: { dismissGameplayTutorial } });
        expect(dismissGameplayTutorial).toHaveBeenCalled();
        const { loadTutorialComplete } = await import('../src/tutorialStorage.js');
        expect(loadTutorialComplete()).toBe(true);
    });

    it('onTutorialFirstScore programme le dismiss via SCORE_TUTORIAL_HOLD_MS', async () => {
        const { onTutorialFirstScore, SCORE_TUTORIAL_HOLD_MS } =
            await import('../src/tutorialProgress.js');
        const delayedCall = vi.fn();
        const showScoreTutorial = vi.fn();
        const dismissGameplayTutorial = vi.fn();
        onTutorialFirstScore({
            time: { delayedCall },
            ui: { showScoreTutorial, dismissGameplayTutorial },
        });
        expect(showScoreTutorial).toHaveBeenCalled();
        expect(delayedCall).toHaveBeenCalledWith(SCORE_TUTORIAL_HOLD_MS, expect.any(Function));
        expect(SCORE_TUTORIAL_HOLD_MS).toBe(2800);
    });
});
