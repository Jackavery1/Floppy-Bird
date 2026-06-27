import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    shouldNotifyRecord,
    cancelPipeSpawnTimer,
    scheduleFirstPipe,
    clearSpawnInvincibility,
    startSpawnInvincibility,
    checkScorePipes,
} from '../src/sceneRound.js';
import { GAME_STATE } from '../src/gameState.js';
import { SOUND } from '../src/config.js';

vi.mock('../src/audio.js', () => ({
    playSound: vi.fn(),
}));

vi.mock('../src/haptics.js', () => ({
    hapticLight: vi.fn(),
}));

describe('sceneRound', () => {
    it('shouldNotifyRecord une seule fois au-delà du record', () => {
        expect(shouldNotifyRecord(6, 5, false)).toBe(true);
        expect(shouldNotifyRecord(6, 5, true)).toBe(false);
        expect(shouldNotifyRecord(3, 5, false)).toBe(false);
        expect(shouldNotifyRecord(1, 0, false)).toBe(false);
    });

    describe('timers', () => {
        let scene;

        beforeEach(() => {
            scene = {
                _pipeSpawnTimer: null,
                _spawnInvincible: false,
                _spawnInvincibleTimer: null,
                state: GAME_STATE.PLAYING,
                pipes: { spawn: vi.fn() },
                time: { delayedCall: vi.fn((_ms, cb) => ({ remove: vi.fn(), cb })) },
            };
        });

        it('cancelPipeSpawnTimer supprime le timer actif', () => {
            const remove = vi.fn();
            scene._pipeSpawnTimer = { remove };
            cancelPipeSpawnTimer(scene);
            expect(remove).toHaveBeenCalledWith(false);
            expect(scene._pipeSpawnTimer).toBeNull();
        });

        it('scheduleFirstPipe spawn si toujours en jeu', () => {
            scene.time.delayedCall = vi.fn((_ms, cb) => {
                cb();
                return { remove: vi.fn() };
            });
            scheduleFirstPipe(scene);
            expect(scene.pipes.spawn).toHaveBeenCalled();
        });

        it('startSpawnInvincibility active puis désactive l’invincibilité', () => {
            scene.time.delayedCall = vi.fn((_ms, cb) => {
                expect(scene._spawnInvincible).toBe(true);
                cb();
                return { remove: vi.fn() };
            });
            startSpawnInvincibility(scene);
            expect(scene._spawnInvincible).toBe(false);
        });

        it('clearSpawnInvincibility réinitialise l’état', () => {
            const remove = vi.fn();
            scene._spawnInvincible = true;
            scene._spawnInvincibleTimer = { remove };
            clearSpawnInvincibility(scene);
            expect(remove).toHaveBeenCalled();
            expect(scene._spawnInvincible).toBe(false);
        });
    });

    describe('checkScorePipes', () => {
        it('incrémente le score et déclenche les effets', async () => {
            const { playSound } = await import('../src/audio.js');
            const { hapticLight } = await import('../src/haptics.js');
            const pipe = { x: 100, scored: false };
            const scene = {
                bird: { x: 130 },
                score: 0,
                _roundHighScore: 0,
                _recordNotified: false,
                pipes: { topPipes: [pipe], pipeWidth: 40, applySpeedForScore: vi.fn() },
                ui: { updateScore: vi.fn(), showRecordBroken: vi.fn() },
                scoreEffects: { show: vi.fn() },
            };
            checkScorePipes(scene);
            expect(pipe.scored).toBe(true);
            expect(scene.score).toBe(1);
            expect(scene.pipes.applySpeedForScore).toHaveBeenCalledWith(1);
            expect(playSound).toHaveBeenCalledWith(SOUND.SCORE, 1);
            expect(hapticLight).toHaveBeenCalled();
        });
    });
});
