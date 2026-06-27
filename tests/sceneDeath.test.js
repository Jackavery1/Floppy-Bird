import { describe, it, expect, vi } from 'vitest';
import { GAME_STATE } from '../src/gameState.js';
import { SOUND } from '../src/config.js';
import { triggerDeath, updateDying } from '../src/sceneDeath.js';

vi.mock('../src/audio.js', () => ({ playSound: vi.fn() }));
vi.mock('../src/haptics.js', () => ({ hapticMedium: vi.fn() }));

describe('sceneDeath', () => {
    it('triggerDeath passe en DYING et enregistre le score', () => {
        const scene = {
            state: GAME_STATE.PLAYING,
            score: 5,
            _dyingFalling: false,
            _dyingGrounded: false,
            _roundHighScore: 3,
            trainingMode: false,
            difficulty: 'normal',
            ui: {
                hideInGameScore: vi.fn(),
                showFlash: vi.fn(),
                saveHighScore: vi.fn(),
                saveToLeaderboard: vi.fn(() => ({ entries: [], highlightId: 'x' })),
            },
            cameras: { main: { shake: vi.fn() } },
            ghost: { finishRound: vi.fn() },
            time: { delayedCall: vi.fn() },
        };
        triggerDeath(scene);
        expect(scene.state).toBe(GAME_STATE.DYING);
        expect(scene.ui.saveHighScore).toHaveBeenCalledWith(5, 'normal');
        expect(scene._isNewRecord).toBe(true);
    });

    it('updateDying termine quand l’oiseau touche le sol', async () => {
        const { playSound } = await import('../src/audio.js');
        const scene = {
            state: GAME_STATE.DYING,
            _dyingFalling: true,
            _dyingGrounded: false,
            score: 2,
            _leaderboardData: { entries: [], highlightId: null },
            _isNewRecord: false,
            game: { loop: { delta: 16.67 } },
            bird: {
                y: 489,
                x: 50,
                sprite: { setPosition: vi.fn() },
                applyFall: vi.fn(),
            },
            gameOverElements: [],
            ui: { showGameOver: vi.fn(() => ({ elements: [{ destroy: vi.fn() }] })) },
        };
        updateDying(scene);
        expect(scene.state).toBe(GAME_STATE.GAME_OVER);
        expect(playSound).toHaveBeenCalledWith(SOUND.GROUND);
    });
});
