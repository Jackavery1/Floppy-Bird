import { describe, it, expect, vi } from 'vitest';
import { GAME_STATE } from '../src/gameState.js';
import { DIFFICULTY } from '../src/config.js';
import {
    showMenu,
    startGame,
    togglePause,
    handlePrimaryAction,
    changeDifficulty,
    toggleTraining,
    toggleHardcore,
    startDailyChallenge,
} from '../src/sceneFlow.js';
import { createRoundState } from '../src/roundState.js';

vi.mock('../src/trainingStorage.js', () => ({
    saveTrainingEnabled: vi.fn(),
    loadTrainingEnabled: vi.fn(() => false),
    loadBestTrainingScore: vi.fn(() => 0),
}));

vi.mock('../src/hardcoreStorage.js', () => ({
    saveHardcoreEnabled: vi.fn(),
}));

vi.mock('../src/textures/pipeTextures.js', () => ({
    ensurePipeTextures: vi.fn(),
}));

vi.mock('../src/tutorialStorage.js', () => ({
    loadTutorialSeen: vi.fn(() => true),
}));

vi.mock('../src/storage.js', () => ({
    loadHighScore: vi.fn(() => 15),
}));

vi.mock('../src/metaStorage.js', () => ({
    loadSelectedSkin: vi.fn(() => 'classic'),
}));

describe('sceneFlow', () => {
    function makeScene(state = GAME_STATE.MENU) {
        return {
            state,
            round: createRoundState(),
            difficulty: DIFFICULTY.NORMAL,
            trainingMode: false,
            hardcoreMode: false,
            playMode: 'classic',
            dailyChallengeMode: false,
            dailyGoal: 0,
            activeSkinId: 'classic',
            time: { timeScale: 1, delayedCall: vi.fn(() => ({ remove: vi.fn() })) },
            bird: { reset: vi.fn(), applyDifficulty: vi.fn(), setSkin: vi.fn(), sprite: { setAlpha: vi.fn() } },
            pipes: {
                reset: vi.fn(),
                setDailySeed: vi.fn(),
                setSpawnHandler: vi.fn(),
                applyRoundDifficulty: vi.fn(),
            },
            ghost: { beginRound: vi.fn(), finishRound: vi.fn() },
            ui: {
                showMenu: vi.fn(() => []),
                clearOverlay: vi.fn(),
                setOverlay: vi.fn(),
                createScoreDisplay: vi.fn(),
                createInGameControls: vi.fn(),
                refreshHighScore: vi.fn(),
                highScore: 0,
                updateDifficultyButtons: vi.fn(),
                updateTrainingLabel: vi.fn(),
                updateHardcoreLabel: vi.fn(),
                refreshHardcoreLockState: vi.fn(),
                showJumpTutorial: vi.fn(),
                showPause: vi.fn(() => ({ elements: [{ destroy: vi.fn() }] })),
            },
            toggleTraining: vi.fn(function toggle() {
                toggleTraining(this);
            }),
            toggleHardcore: vi.fn(function toggle() {
                toggleHardcore(this);
            }),
            launchDailyChallenge: vi.fn(function launch() {
                startDailyChallenge(this);
            }),
        };
    }

    it('showMenu remet l’état MENU', () => {
        const scene = makeScene(GAME_STATE.PLAYING);
        showMenu(scene);
        expect(scene.state).toBe(GAME_STATE.MENU);
        expect(scene.ui.showMenu).toHaveBeenCalled();
    });

    it('startGame depuis le menu lance un round', () => {
        const scene = makeScene(GAME_STATE.MENU);
        startGame(scene);
        expect(scene.ui.clearOverlay).toHaveBeenCalledWith('menu');
        expect(scene.state).toBe(GAME_STATE.PLAYING);
    });

    it('togglePause bascule PLAYING ↔ PAUSED', () => {
        const scene = makeScene(GAME_STATE.PLAYING);
        scene.togglePause = function () { togglePause(this); };
        togglePause(scene);
        expect(scene.state).toBe(GAME_STATE.PAUSED);
        expect(scene.time.paused).toBe(true);
        togglePause(scene);
        expect(scene.state).toBe(GAME_STATE.PLAYING);
        expect(scene.time.paused).toBe(false);
    });

    it('handlePrimaryAction reprend la pause sans sauter', () => {
        const scene = makeScene(GAME_STATE.PAUSED);
        scene.time.paused = true;
        scene.togglePause = function () { togglePause(this); };
        handlePrimaryAction(scene);
        expect(scene.state).toBe(GAME_STATE.PLAYING);
        expect(scene.round.jumpBufferFrames).toBe(0);
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

    it('toggleHardcore bascule le mode hardcore au menu', () => {
        const scene = makeScene(GAME_STATE.MENU);
        toggleHardcore(scene);
        expect(scene.hardcoreMode).toBe(true);
    });

    it('startDailyChallenge lance une manche daily', () => {
        const scene = makeScene(GAME_STATE.MENU);
        startDailyChallenge(scene);
        expect(scene.playMode).toBe('daily');
        expect(scene.dailyChallengeMode).toBe(true);
        expect(scene.state).toBe(GAME_STATE.PLAYING);
    });

    it('toggleTraining désactive le hardcore (exclusifs)', async () => {
        const { saveHardcoreEnabled } = await import('../src/hardcoreStorage.js');
        const scene = makeScene(GAME_STATE.MENU);
        scene.hardcoreMode = true;
        toggleTraining(scene);
        expect(scene.trainingMode).toBe(true);
        expect(scene.hardcoreMode).toBe(false);
        expect(saveHardcoreEnabled).toHaveBeenCalledWith(false);
    });

    it('toggleHardcore désactive l’entraînement (exclusifs)', async () => {
        const { saveTrainingEnabled } = await import('../src/trainingStorage.js');
        const scene = makeScene(GAME_STATE.MENU);
        scene.trainingMode = true;
        toggleHardcore(scene);
        expect(scene.hardcoreMode).toBe(true);
        expect(scene.trainingMode).toBe(false);
        expect(saveTrainingEnabled).toHaveBeenCalledWith(false);
    });

    it('handlePrimaryAction démarre la partie depuis le menu', () => {
        const scene = makeScene(GAME_STATE.MENU);
        handlePrimaryAction(scene);
        expect(scene.ui.clearOverlay).toHaveBeenCalledWith('menu');
        expect(scene.state).toBe(GAME_STATE.PLAYING);
    });

    it('handlePrimaryAction rejoue le défi daily depuis le game over', () => {
        const scene = makeScene(GAME_STATE.GAME_OVER);
        scene.playMode = 'daily';
        scene.dailyChallengeMode = true;
        handlePrimaryAction(scene);
        expect(scene.ui.clearOverlay).toHaveBeenCalledWith('gameOver');
        expect(scene.playMode).toBe('daily');
        expect(scene.state).toBe(GAME_STATE.PLAYING);
    });
});
