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

describe('sceneDeath', () => {
    it('triggerDeath passe en DYING et enregistre le score', async () => {
        const { persistRoundScore } = await import('../src/roundScore.js');
        const { playDeathImpactFeedback } = await import('../src/sceneFeedback.js');
        const round = createRoundState();
        round.score = 5;
        round.roundHighScore = 3;
        const scene = {
            state: GAME_STATE.PLAYING,
            round,
            trainingMode: false,
            hardcoreMode: false,
            difficulty: 'normal',
            bird: { velocityY: 3 },
            ghost: { finishRound: vi.fn() },
            time: { delayedCall: vi.fn() },
        };
        triggerDeath(scene);
        expect(scene.state).toBe(GAME_STATE.DYING);
        expect(playDeathImpactFeedback).toHaveBeenCalledWith(scene);
        expect(persistRoundScore).toHaveBeenCalledWith(scene);
        expect(scene.bird.velocityY).toBe(0);
        expect(scene.round.isNewRecord).toBe(true);
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
                showGameOver: vi.fn(() => ({ elements: [{ destroy: vi.fn() }] })),
                setOverlay: vi.fn(),
            },
        };
        updateDying(scene);
        expect(scene.state).toBe(GAME_STATE.GAME_OVER);
        expect(scene.ui.highScore).toBe(7);
        expect(playGroundImpactFeedback).toHaveBeenCalled();
        expect(notifyEndOfRoundAchievements).toHaveBeenCalledWith(scene);
        expect(scene.ui.setOverlay).toHaveBeenCalledWith('gameOver', expect.any(Array));
    });
});
