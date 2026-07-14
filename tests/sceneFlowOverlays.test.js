import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GAME_STATE } from '../src/gameState.js';
import {
    applyPausedState,
    applyPlayingState,
    clearPauseOverlay,
    clearStaleOverlays,
    enterPauseOverlay,
    exitGameOverForRound,
    exitMenuForRound,
    resumeFromPauseOverlay,
} from '../src/sceneFlowOverlays.js';

vi.mock('../src/sceneA11ySync.js', () => ({
    enterPauseAccessibility: vi.fn(),
    exitPauseAccessibility: vi.fn(),
    hideAccessibilityForRoundStart: vi.fn(),
}));

vi.mock('../src/sceneMenuSync.js', () => ({
    closeMenuPanelsForRoundStart: vi.fn(),
}));

vi.mock('../src/shellGameState.js', () => ({
    syncShellGameState: vi.fn(),
}));

describe('sceneFlowOverlays', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    function makeScene(state = GAME_STATE.MENU) {
        return {
            state,
            time: { paused: false },
            ui: {
                clearOverlay: vi.fn(),
                showPause: vi.fn(() => ({ elements: [{ destroy: vi.fn() }] })),
                setOverlay: vi.fn(),
            },
        };
    }

    it('applyPlayingState reprend le jeu', async () => {
        const { syncShellGameState } = await import('../src/shellGameState.js');
        const scene = makeScene(GAME_STATE.PAUSED);
        scene.time.paused = true;
        applyPlayingState(scene);
        expect(scene.state).toBe(GAME_STATE.PLAYING);
        expect(scene.time.paused).toBe(false);
        expect(syncShellGameState).toHaveBeenCalledWith(GAME_STATE.PLAYING);
    });

    it('applyPausedState met en pause', async () => {
        const { syncShellGameState } = await import('../src/shellGameState.js');
        const scene = makeScene(GAME_STATE.PLAYING);
        applyPausedState(scene);
        expect(scene.state).toBe(GAME_STATE.PAUSED);
        expect(scene.time.paused).toBe(true);
        expect(syncShellGameState).toHaveBeenCalledWith(GAME_STATE.PAUSED);
    });

    it('clearStaleOverlays nettoie menu et pause', () => {
        const scene = makeScene();
        clearStaleOverlays(scene);
        expect(scene.ui.clearOverlay).toHaveBeenCalledWith('menu');
        expect(scene.ui.clearOverlay).toHaveBeenCalledWith('pause');
    });

    it('clearPauseOverlay nettoie pause et masque a11y', async () => {
        const { hideAccessibilityForRoundStart } = await import('../src/sceneA11ySync.js');
        const scene = makeScene(GAME_STATE.PAUSED);
        clearPauseOverlay(scene);
        expect(scene.ui.clearOverlay).toHaveBeenCalledWith('pause');
        expect(hideAccessibilityForRoundStart).toHaveBeenCalled();
    });

    it('exitMenuForRound ferme le menu', async () => {
        const { closeMenuPanelsForRoundStart } = await import('../src/sceneMenuSync.js');
        const { hideAccessibilityForRoundStart } = await import('../src/sceneA11ySync.js');
        const scene = makeScene();
        exitMenuForRound(scene);
        expect(closeMenuPanelsForRoundStart).toHaveBeenCalledWith(scene);
        expect(hideAccessibilityForRoundStart).toHaveBeenCalled();
        expect(scene.ui.clearOverlay).toHaveBeenCalledWith('menu');
    });

    it('exitGameOverForRound ferme le game over', async () => {
        const { hideAccessibilityForRoundStart } = await import('../src/sceneA11ySync.js');
        const scene = makeScene(GAME_STATE.GAME_OVER);
        exitGameOverForRound(scene);
        expect(hideAccessibilityForRoundStart).toHaveBeenCalled();
        expect(scene.ui.clearOverlay).toHaveBeenCalledWith('gameOver');
    });

    it('enterPauseOverlay affiche pause et a11y', async () => {
        const { enterPauseAccessibility } = await import('../src/sceneA11ySync.js');
        const scene = makeScene(GAME_STATE.PLAYING);
        const callbacks = { onResume: vi.fn(), onMenu: vi.fn() };
        enterPauseOverlay(scene, callbacks);
        expect(scene.state).toBe(GAME_STATE.PAUSED);
        expect(scene.ui.showPause).toHaveBeenCalledWith(callbacks);
        expect(scene.ui.setOverlay).toHaveBeenCalledWith('pause', expect.any(Array));
        expect(enterPauseAccessibility).toHaveBeenCalledWith(scene);
    });

    it('resumeFromPauseOverlay reprend la partie', async () => {
        const { exitPauseAccessibility } = await import('../src/sceneA11ySync.js');
        const scene = makeScene(GAME_STATE.PAUSED);
        resumeFromPauseOverlay(scene);
        expect(scene.state).toBe(GAME_STATE.PLAYING);
        expect(scene.ui.clearOverlay).toHaveBeenCalledWith('pause');
        expect(exitPauseAccessibility).toHaveBeenCalledWith(scene);
    });
});
