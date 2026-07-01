import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    shouldNotifyRecord,
    cancelPipeSpawnTimer,
    scheduleFirstPipe,
    clearSpawnInvincibility,
    startSpawnInvincibility,
    checkScorePipes,
    onPipeSpawned,
} from '../src/sceneRound.js';
import { GAME_STATE } from '../src/gameState.js';
import { createRoundState } from '../src/roundState.js';

vi.mock('../src/sceneRoundFeedback.js', () => ({
    playScoreFeedback: vi.fn(),
}));

vi.mock('../src/metaAchievements.js', () => ({
    notifyAchievementUnlocks: vi.fn(),
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
                round: createRoundState(),
                state: GAME_STATE.PLAYING,
                pipes: { spawn: vi.fn() },
                time: { delayedCall: vi.fn((_ms, cb) => ({ remove: vi.fn(), cb })) },
            };
        });

        it('cancelPipeSpawnTimer supprime le timer actif', () => {
            const remove = vi.fn();
            scene.round.pipeSpawnTimer = { remove };
            cancelPipeSpawnTimer(scene);
            expect(remove).toHaveBeenCalledWith(false);
            expect(scene.round.pipeSpawnTimer).toBeNull();
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
                expect(scene.round.spawnInvincible).toBe(true);
                cb();
                return { remove: vi.fn() };
            });
            startSpawnInvincibility(scene);
            expect(scene.round.spawnInvincible).toBe(false);
        });

        it('clearSpawnInvincibility réinitialise l’état', () => {
            const remove = vi.fn();
            scene.round.spawnInvincible = true;
            scene.round.spawnInvincibleTimer = { remove };
            clearSpawnInvincibility(scene);
            expect(remove).toHaveBeenCalled();
            expect(scene.round.spawnInvincible).toBe(false);
        });
    });

    describe('checkScorePipes', () => {
        it('incrémente le score et déclenche les effets', async () => {
            const { playScoreFeedback } = await import('../src/sceneRoundFeedback.js');
            const pipe = { x: 100, scored: false };
            const scene = {
                bird: { x: 130 },
                round: createRoundState(),
                pipes: { topPipes: [pipe], pipeWidth: 40, applySpeedForScore: vi.fn() },
                ui: { updateScore: vi.fn(), showRecordBroken: vi.fn() },
                scoreEffects: { show: vi.fn() },
            };
            checkScorePipes(scene);
            expect(pipe.scored).toBe(true);
            expect(scene.round.score).toBe(1);
            expect(scene.pipes.applySpeedForScore).toHaveBeenCalledWith(1);
            expect(playScoreFeedback).toHaveBeenCalledWith(1);
        });
    });

    it('onPipeSpawned rafraîchit la grace hardcore par paliers', () => {
        const scene = {
            hardcoreMode: true,
            round: createRoundState(),
            time: { delayedCall: vi.fn(() => ({ remove: vi.fn() })) },
            bird: { sprite: { setAlpha: vi.fn() } },
        };
        onPipeSpawned(scene, 2);
        expect(scene.round.spawnInvincible).toBe(true);
    });

    it('onPipeSpawned ignore le mode normal', () => {
        const scene = {
            hardcoreMode: false,
            round: createRoundState(),
            time: { delayedCall: vi.fn(() => ({ remove: vi.fn() })) },
        };
        onPipeSpawned(scene, 1);
        expect(scene.round.spawnInvincible).toBe(false);
    });
});
