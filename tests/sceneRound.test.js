import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    shouldNotifyRecord,
    cancelPipeSpawnTimer,
    scheduleFirstPipe,
    clearSpawnInvincibility,
    startSpawnInvincibility,
    checkScorePipes,
    onPipeSpawned,
    tickPipeSpawnFallback,
    spawnPipeWave,
} from '../src/sceneRound.js';
import { GAME_CONFIG } from '../src/config.js';
import { GAME_STATE } from '../src/gameState.js';
import { createRoundState } from '../src/roundState.js';

vi.mock('../src/sceneFeedback.js', () => ({
    playScoreFeedback: vi.fn(),
}));

vi.mock('../src/metaAchievements.js', () => ({
    notifyAchievementUnlocks: vi.fn(),
}));

vi.mock('../src/tutorialProgress.js', () => ({
    onTutorialFirstScore: vi.fn(),
}));

vi.mock('../src/textures/pipeTextures.js', () => ({
    ensurePipeTextures: vi.fn(),
}));

describe('sceneRound', () => {
    it('shouldNotifyRecord une seule fois au-delà du record', () => {
        expect(shouldNotifyRecord(6, 5, false)).toBe(true);
        expect(shouldNotifyRecord(6, 5, true)).toBe(false);
        expect(shouldNotifyRecord(3, 5, false)).toBe(false);
        expect(shouldNotifyRecord(1, 0, false)).toBe(true);
    });

    describe('timers', () => {
        let scene;

        beforeEach(() => {
            scene = {
                round: createRoundState(),
                state: GAME_STATE.PLAYING,
                pipes: { spawn: vi.fn(), topPipes: [] },
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

        it('scheduleFirstPipe utilise le délai config', () => {
            scene.time.delayedCall = vi.fn(() => ({ remove: vi.fn() }));
            scheduleFirstPipe(scene);
            expect(scene.time.delayedCall).toHaveBeenCalledWith(
                GAME_CONFIG.round.pipeSpawnDelayMs,
                expect.any(Function)
            );
        });

        it('scheduleFirstPipe spawn si toujours en jeu', () => {
            scene.time.delayedCall = vi.fn((_ms, cb) => {
                cb();
                return { remove: vi.fn() };
            });
            scheduleFirstPipe(scene);
            expect(scene.pipes.spawn).toHaveBeenCalled();
        });

        it('scheduleFirstPipe ignore si des tuyaux existent déjà', () => {
            scene.pipes.topPipes = [{ x: 100 }];
            scene.time.delayedCall = vi.fn((_ms, cb) => {
                cb();
                return { remove: vi.fn() };
            });
            scheduleFirstPipe(scene);
            expect(scene.pipes.spawn).not.toHaveBeenCalled();
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
        function birdAt(x) {
            return {
                x,
                getBounds: () => ({
                    x: x - GAME_CONFIG.bird.width / 2 + 3,
                    y: 0,
                    width: GAME_CONFIG.bird.width - 6,
                    height: GAME_CONFIG.bird.height - 4,
                }),
            };
        }

        it('incrémente le score quand la hitbox dépasse le bord droit du tuyau', async () => {
            const { playScoreFeedback } = await import('../src/sceneFeedback.js');
            const pipe = { x: 100, scored: false };
            const scene = {
                bird: birdAt(132),
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

        it('n’incrémente pas le score tant que la hitbox n’a pas dépassé le tuyau', () => {
            const pipe = { x: 100, scored: false };
            const scene = {
                bird: birdAt(130),
                round: createRoundState(),
                pipes: { topPipes: [pipe], pipeWidth: 40, applySpeedForScore: vi.fn() },
                ui: { updateScore: vi.fn(), showRecordBroken: vi.fn() },
                scoreEffects: { show: vi.fn() },
            };
            checkScorePipes(scene);
            expect(pipe.scored).toBe(false);
            expect(scene.round.score).toBe(0);
        });
    });

    describe('tickPipeSpawnFallback', () => {
        it('spawn via fallback après le délai et annule le timer Phaser', () => {
            const remove = vi.fn();
            const round = createRoundState();
            round.pipeSpawnTimer = { remove };
            const scene = {
                state: GAME_STATE.PLAYING,
                time: { timeScale: 1 },
                round,
                pipes: {
                    topPipes: [],
                    _autoSpawnEnabled: false,
                    spawn: vi.fn(function () {
                        this.topPipes.push({ x: 300 });
                    }),
                },
            };
            tickPipeSpawnFallback(scene, 1300);
            expect(scene.pipes.spawn).toHaveBeenCalled();
            expect(remove).toHaveBeenCalledWith(false);
            expect(scene.round.pipeSpawnTimer).toBeNull();
        });

        it('respecte le timeScale en mode entraînement', () => {
            const scene = {
                state: GAME_STATE.PLAYING,
                time: { timeScale: 0.8 },
                round: createRoundState(),
                pipes: {
                    topPipes: [],
                    _autoSpawnEnabled: false,
                    spawn: vi.fn(),
                },
            };
            tickPipeSpawnFallback(scene, 1000);
            expect(scene.round._pipeSpawnWaitMs).toBe(800);
        });

        it('n’agit pas si des tuyaux sont déjà présents', () => {
            const scene = {
                state: GAME_STATE.PLAYING,
                time: { timeScale: 1 },
                round: createRoundState(),
                pipes: {
                    topPipes: [{ x: 100 }],
                    _autoSpawnEnabled: false,
                    spawn: vi.fn(),
                },
            };
            tickPipeSpawnFallback(scene, 2000);
            expect(scene.pipes.spawn).not.toHaveBeenCalled();
        });
    });

    it('spawnPipeWave retourne false si hors jeu', () => {
        const scene = { state: GAME_STATE.MENU, pipes: { spawn: vi.fn() } };
        expect(spawnPipeWave(scene)).toBe(false);
    });

    it('onPipeSpawned ne renouvelle plus la grace hardcore par tuyau', () => {
        const scene = {
            hardcoreMode: true,
            round: createRoundState(),
            time: { delayedCall: vi.fn(() => ({ remove: vi.fn() })) },
            bird: { sprite: { setAlpha: vi.fn() } },
        };
        onPipeSpawned(scene, 2);
        expect(scene.round.spawnInvincible).toBe(false);
        expect(scene.time.delayedCall).not.toHaveBeenCalled();
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
