import { describe, it, expect, vi } from 'vitest';
import { GAME_STATE } from '../src/gameState.js';
import { DIFFICULTY } from '../src/config.js';
import { beginRound } from '../src/sceneBeginRound.js';
import { createRoundState } from '../src/roundState.js';

vi.mock('../src/tutorialStorage.js', () => ({
    loadTutorialSeen: vi.fn(() => true),
}));

vi.mock('../src/textures/pipeTextures.js', () => ({
    ensurePipeTextures: vi.fn(),
}));

vi.mock('../src/metaStorage.js', () => ({
    loadSelectedSkin: vi.fn(() => 'classic'),
}));

describe('sceneBeginRound', () => {
    function makeScene() {
        return {
            state: GAME_STATE.MENU,
            round: createRoundState(),
            difficulty: DIFFICULTY.NORMAL,
            trainingMode: false,
            hardcoreMode: false,
            dailyChallengeMode: true,
            time: { timeScale: 1, delayedCall: vi.fn(() => ({ remove: vi.fn() })) },
            bird: { reset: vi.fn(), applyDifficulty: vi.fn(), setSkin: vi.fn(), sprite: { setAlpha: vi.fn() } },
            pipes: {
                reset: vi.fn(),
                setDailySeed: vi.fn(),
                setSpawnHandler: vi.fn(),
                applyRoundDifficulty: vi.fn(),
            },
            ghost: { beginRound: vi.fn() },
            ui: {
                clearOverlay: vi.fn(),
                createScoreDisplay: vi.fn(),
                createInGameControls: vi.fn(),
                refreshHighScore: vi.fn(),
                highScore: 0,
                showJumpTutorial: vi.fn(),
            },
            togglePause: vi.fn(),
        };
    }

    it('beginRound démarre une partie en PLAYING', () => {
        const scene = makeScene();
        beginRound(scene, { resetBird: true });
        expect(scene.state).toBe(GAME_STATE.PLAYING);
        expect(scene.ui.clearOverlay).toHaveBeenCalledWith('menu');
        expect(scene.ui.clearOverlay).toHaveBeenCalledWith('pause');
        expect(scene.bird.reset).toHaveBeenCalled();
        expect(scene.ui.createInGameControls).toHaveBeenCalled();
    });

    it('beginRound avec invincibilité réduite en hardcore', () => {
        const scene = makeScene();
        scene.hardcoreMode = true;
        beginRound(scene);
        expect(scene.round.spawnInvincible).toBe(true);
    });

    it('beginRound applique la seed daily uniquement si activé', () => {
        const scene = makeScene();
        beginRound(scene);
        expect(scene.pipes.setDailySeed).toHaveBeenCalled();

        scene.pipes.setDailySeed.mockClear();
        scene.dailyChallengeMode = false;
        beginRound(scene);
        expect(scene.pipes.setDailySeed).toHaveBeenCalledWith(null);
    });

    it('beginRound lance le ghost en mode entraînement', () => {
        const scene = makeScene();
        scene.trainingMode = true;
        beginRound(scene);
        expect(scene.ghost.beginRound).toHaveBeenCalled();
    });
});
