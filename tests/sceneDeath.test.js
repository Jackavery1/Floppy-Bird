import { describe, it, expect, vi } from 'vitest';
import { GAME_STATE } from '../src/gameState.js';
import { triggerDeath, updateDying } from '../src/sceneDeath.js';
import { createRoundState } from '../src/roundState.js';

vi.mock('../src/sceneFeedback.js', () => ({
    playDeathImpactFeedback: vi.fn(),
    playGroundImpactFeedback: vi.fn(),
}));
vi.mock('../src/roundScore.js', () => ({
    persistRoundScore: vi.fn(() => ({
        isNewRecord: true,
        leaderboardData: { entries: [], highlightId: 'x' },
    })),
}));
vi.mock('../src/metaAchievements.js', () => ({
    notifyEndOfRoundAchievements: vi.fn(),
}));
vi.mock('../src/sceneA11ySync.js', () => ({
    announceDeathStarted: vi.fn(),
    openGameOverAccessibility: vi.fn(),
}));
vi.mock('../src/dailyChallengeProgress.js', () => ({
    saveDailyCompletion: vi.fn(),
}));
vi.mock('../src/shellGameState.js', () => ({
    syncShellGameState: vi.fn(),
}));
vi.mock('../src/uiGameOverLoader.js', () => ({
    preloadGameOverUI: vi.fn(() => Promise.resolve()),
}));

describe('sceneDeath', () => {
    it('triggerDeath passe en DYING et enregistre le score', async () => {
        const { persistRoundScore } = await import('../src/roundScore.js');
        const { playDeathImpactFeedback } = await import('../src/sceneFeedback.js');
        const { announceDeathStarted } = await import('../src/sceneA11ySync.js');
        const round = createRoundState();
        round.score = 5;
        round.roundHighScore = 3;
        round.startedAt = 1000;
        const scene = {
            state: GAME_STATE.PLAYING,
            round,
            bird: { velocityY: 3 },
            ghost: { finishRound: vi.fn() },
            time: { delayedCall: vi.fn(), now: 2500 },
        };
        triggerDeath(scene, 'ground');
        expect(scene.state).toBe(GAME_STATE.DYING);
        expect(announceDeathStarted).toHaveBeenCalledWith('ground', 5);
        expect(scene.round.deathCause).toBe('ground');
        expect(scene.round.lastDeathMetrics).toMatchObject({
            cause: 'ground',
            score: 5,
            elapsedMs: 1500,
            isEarlyDeath: true,
            beforeFirstPipe: false,
        });
        expect(playDeathImpactFeedback).toHaveBeenCalledWith(scene, 'ground');
        expect(persistRoundScore).toHaveBeenCalledWith(scene);
        expect(scene.bird.velocityY).toBe(0);
        expect(scene.round.isNewRecord).toBe(true);
    });

    it('triggerDeath pipe enregistre la cause de mort', async () => {
        const round = createRoundState();
        round.coyoteFrames = 3;
        const scene = {
            state: GAME_STATE.PLAYING,
            round,
            bird: { velocityY: 0 },
            ghost: { finishRound: vi.fn() },
            time: { delayedCall: vi.fn() },
        };
        triggerDeath(scene, 'pipe');
        expect(scene.round.deathCause).toBe('pipe');
    });

    it('updateDying termine quand l’oiseau touche le sol', async () => {
        const { playGroundImpactFeedback } = await import('../src/sceneFeedback.js');
        const { notifyEndOfRoundAchievements } = await import('../src/metaAchievements.js');
        const round = createRoundState();
        round.score = 2;
        round.dyingFalling = true;
        round.leaderboardData = { entries: [], highlightId: null };
        round.roundHighScore = 7;
        const scene = {
            state: GAME_STATE.DYING,
            playMode: 'classic',
            round,
            hardcoreMode: false,
            game: { loop: { delta: 16.67 } },
            bird: {
                y: 489,
                x: 50,
                velocityY: 5,
                sprite: { setPosition: vi.fn() },
                applyFall: vi.fn(),
            },
            ui: {
                highScore: 0,
                showGameOverLoading: vi.fn(),
                hideGameOverLoading: vi.fn(),
                showGameOver: vi.fn(() => ({ elements: [{ destroy: vi.fn() }] })),
                setOverlay: vi.fn(),
            },
        };
        updateDying(scene);
        await Promise.resolve();
        const { openGameOverAccessibility } = await import('../src/sceneA11ySync.js');
        expect(scene.state).toBe(GAME_STATE.GAME_OVER);
        expect(scene.ui.highScore).toBe(7);
        expect(playGroundImpactFeedback).toHaveBeenCalled();
        expect(notifyEndOfRoundAchievements).toHaveBeenCalledWith(scene);
        expect(scene.ui.setOverlay).toHaveBeenCalledWith('gameOver', expect.any(Array));
        expect(scene.ui.showGameOverLoading).toHaveBeenCalled();
        expect(scene.ui.hideGameOverLoading).toHaveBeenCalled();
        expect(openGameOverAccessibility).toHaveBeenCalledWith(scene, {
            score: 2,
            isDaily: false,
        });
    });

    it('updateDying daily sauvegarde la complétion', async () => {
        const { saveDailyCompletion } = await import('../src/dailyChallengeProgress.js');
        const round = createRoundState();
        round.score = 12;
        round.dyingFalling = true;
        round.leaderboardData = { entries: [], highlightId: null };
        round.roundHighScore = 7;
        const scene = {
            state: GAME_STATE.DYING,
            playMode: 'daily',
            dailyGoal: 10,
            difficulty: 'normal',
            activeSkinId: 'classic',
            round,
            hardcoreMode: false,
            game: { loop: { delta: 16.67 } },
            bird: {
                y: 489,
                x: 50,
                velocityY: 5,
                sprite: { setPosition: vi.fn() },
                applyFall: vi.fn(),
            },
            ui: {
                highScore: 0,
                showGameOverLoading: vi.fn(),
                hideGameOverLoading: vi.fn(),
                showGameOver: vi.fn(() => ({ elements: [{ destroy: vi.fn() }] })),
                setOverlay: vi.fn(),
            },
        };
        updateDying(scene);
        await Promise.resolve();
        expect(saveDailyCompletion).toHaveBeenCalled();
        expect(scene.state).toBe(GAME_STATE.GAME_OVER);
    });

    it('triggerDeath planifie la chute après 166 ms', () => {
        const round = createRoundState();
        const scene = {
            state: GAME_STATE.PLAYING,
            round,
            bird: { velocityY: 5 },
            ghost: { finishRound: vi.fn() },
            time: { delayedCall: vi.fn() },
        };
        triggerDeath(scene, 'pipe');
        expect(scene.time.delayedCall).toHaveBeenCalledWith(166, expect.any(Function));
    });
});
