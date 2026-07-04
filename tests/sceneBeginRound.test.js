import { describe, it, expect, vi } from 'vitest';
import { GAME_STATE } from '../src/gameState.js';
import { DIFFICULTY } from '../src/config.js';
import { beginRound } from '../src/sceneBeginRound.js';
import { createRoundState } from '../src/roundState.js';
import { applySkinPatternToDifficulty } from '../src/skinPatterns.js';

vi.mock('../src/tutorialStorage.js', () => ({
    loadTutorialComplete: vi.fn(() => true),
    loadTutorialProgress: vi.fn(() => 3),
    loadTutorialSeen: vi.fn(() => true),
    incrementRoundsStarted: vi.fn(() => 1),
}));

vi.mock('../src/hardcoreStorage.js', () => ({
    loadHardcoreTutorialSeen: vi.fn(() => false),
    markHardcoreTutorialSeen: vi.fn(),
}));

vi.mock('../src/skinPatterns.js', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        applySkinPatternToDifficulty: vi.fn((diff) => ({ ...diff, gravity: diff.gravity * 2 })),
    };
});

vi.mock('../src/textures/pipeTextures.js', () => ({
    ensurePipeTextures: vi.fn(),
}));

vi.mock('../src/metaStorage.js', () => ({
    loadSelectedSkin: vi.fn(() => 'classic'),
}));

vi.mock('../src/storage.js', () => ({
    loadHighScore: vi.fn(() => 42),
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
            bird: {
                reset: vi.fn(),
                applyDifficulty: vi.fn(),
                setSkin: vi.fn(),
                sprite: { setAlpha: vi.fn() },
            },
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
                showHardcoreTutorial: vi.fn(),
                showDailyGoalBrief: vi.fn(),
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
        expect(scene.round.roundHighScore).toBe(42);
    });

    it('beginRound avec invincibilité réduite en hardcore', () => {
        const scene = makeScene();
        scene.hardcoreMode = true;
        beginRound(scene);
        expect(scene.round.spawnInvincible).toBe(true);
        expect(scene.ui.showHardcoreTutorial).toHaveBeenCalled();
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

    it('beginRound applique la physique skin uniquement en défi du jour', () => {
        const scene = makeScene();
        scene.playMode = 'classic';
        beginRound(scene);
        expect(applySkinPatternToDifficulty).not.toHaveBeenCalled();

        vi.mocked(applySkinPatternToDifficulty).mockClear();
        scene.playMode = 'daily';
        beginRound(scene);
        expect(applySkinPatternToDifficulty).toHaveBeenCalled();
        expect(scene.ui.showDailyGoalBrief).toHaveBeenCalled();
    });

    it('beginRound lance le ghost en mode entraînement', () => {
        const scene = makeScene();
        scene.trainingMode = true;
        beginRound(scene);
        expect(scene.ghost.beginRound).toHaveBeenCalledWith({ record: true });
    });

    it('beginRound affiche le ghost en défi daily sans enregistrer', () => {
        const scene = makeScene();
        scene.playMode = 'daily';
        scene.trainingMode = false;
        beginRound(scene);
        expect(scene.ghost.beginRound).toHaveBeenCalledWith({ record: false });
    });
});
