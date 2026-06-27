import { describe, it, expect, vi } from 'vitest';
import { GAME_STATE } from '../src/gameState.js';
import { DIFFICULTY } from '../src/config.js';
import {
    showMenu,
    beginRound,
    startGame,
    togglePause,
    handlePrimaryAction,
    changeDifficulty,
    toggleTraining,
} from '../src/sceneFlow.js';

vi.mock('../src/trainingStorage.js', () => ({
    saveTrainingEnabled: vi.fn(),
}));

describe('sceneFlow', () => {
    function makeScene(state = GAME_STATE.MENU) {
        return {
            state,
            score: 0,
            difficulty: DIFFICULTY.NORMAL,
            trainingMode: false,
            menuElements: [],
            gameOverElements: [],
            _pauseElements: [],
            _jumpBufferFrames: 0,
            _recordNotified: false,
            _isNewRecord: false,
            _roundHighScore: 0,
            _pipeSpawnTimer: null,
            _spawnInvincible: false,
            _spawnInvincibleTimer: null,
            time: { timeScale: 1, delayedCall: vi.fn(() => ({ remove: vi.fn() })) },
            bird: { reset: vi.fn(), applyDifficulty: vi.fn() },
            pipes: { reset: vi.fn(), setDifficulty: vi.fn() },
            ghost: { beginRound: vi.fn(), finishRound: vi.fn() },
            ui: {
                showMenu: vi.fn(() => []),
                createScoreDisplay: vi.fn(),
                createInGameControls: vi.fn(),
                refreshHighScore: vi.fn(),
                highScore: 0,
                updateDifficultyButtons: vi.fn(),
                updateTrainingLabel: vi.fn(),
                showPause: vi.fn(() => ({ elements: [{ destroy: vi.fn() }] })),
            },
            togglePause: vi.fn(function toggle() {
                togglePause(this);
            }),
        };
    }

    it('showMenu remet l’état MENU', () => {
        const scene = makeScene(GAME_STATE.PLAYING);
        showMenu(scene);
        expect(scene.state).toBe(GAME_STATE.MENU);
        expect(scene.ui.showMenu).toHaveBeenCalled();
    });

    it('beginRound démarre une partie', () => {
        const scene = makeScene(GAME_STATE.MENU);
        beginRound(scene, { resetBird: true });
        expect(scene.state).toBe(GAME_STATE.PLAYING);
        expect(scene.bird.reset).toHaveBeenCalled();
        expect(scene.ui.createInGameControls).toHaveBeenCalled();
    });

    it('startGame depuis le menu lance un round', () => {
        const scene = makeScene(GAME_STATE.MENU);
        scene.menuElements = [{ destroy: vi.fn() }];
        startGame(scene);
        expect(scene.state).toBe(GAME_STATE.PLAYING);
    });

    it('togglePause bascule PLAYING ↔ PAUSED', () => {
        const scene = makeScene(GAME_STATE.PLAYING);
        scene.togglePause = function () { togglePause(this); };
        togglePause(scene);
        expect(scene.state).toBe(GAME_STATE.PAUSED);
        togglePause(scene);
        expect(scene.state).toBe(GAME_STATE.PLAYING);
    });

    it('changeDifficulty met à jour la difficulté au menu', () => {
        const scene = makeScene(GAME_STATE.MENU);
        changeDifficulty(scene, DIFFICULTY.HARD);
        expect(scene.difficulty).toBe(DIFFICULTY.HARD);
    });

    it('toggleTraining bascule le mode entraînement au menu', () => {
        const scene = makeScene(GAME_STATE.MENU);
        toggleTraining(scene);
        expect(scene.trainingMode).toBe(true);
    });

    it('handlePrimaryAction démarre la partie depuis le menu', () => {
        const scene = makeScene(GAME_STATE.MENU);
        scene.menuElements = [{ destroy: vi.fn() }];
        handlePrimaryAction(scene);
        expect(scene.state).toBe(GAME_STATE.PLAYING);
    });
});
