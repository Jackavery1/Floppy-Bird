import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Pipes } from '../src/pipes.js';
import { smoothGapY } from '../src/pipeGaps.js';
import { GAME_CONFIG, getScriptedPipeGapY } from '../src/config.js';
import { maxGapDeltaForScore } from '../src/gapDifficulty.js';

function createMockScene() {
    const scene = {
        bird: null,
        textures: {
            exists: vi.fn(() => true),
            get: vi.fn(() => ({ source: [{ width: 64, height: 500 }] })),
            remove: vi.fn(),
            createCanvas: vi.fn(() => ({
                context: { clearRect: vi.fn(), fillRect: vi.fn(), fillStyle: '' },
                refresh: vi.fn(),
            })),
        },
        add: {
            graphics: vi.fn(() => ({
                fillStyle: vi.fn().mockReturnThis(),
                fillRect: vi.fn().mockReturnThis(),
                generateTexture: vi.fn(),
                setVisible: vi.fn().mockReturnThis(),
                destroy: vi.fn(),
            })),
            sprite: vi.fn(() => ({
                x: 0,
                y: 0,
                scored: false,
                setDisplaySize: vi.fn(),
                setOrigin: vi.fn(),
                setDepth: vi.fn(),
                setTexture: vi.fn(),
                setActive: vi.fn(function () {
                    return this;
                }),
                setVisible: vi.fn(function () {
                    return this;
                }),
                destroy: vi.fn(),
            })),
        },
    };
    return scene;
}

describe('Pipes', () => {
    let scene;
    let pipes;

    beforeEach(() => {
        scene = createMockScene();
        pipes = new Pipes(scene);
    });

    describe('checkCollisionWithBird', () => {
        it('détecte une collision avec un tuyau du haut', () => {
            pipes.topPipes.push({ x: 200, y: 150 });
            const birdBounds = { x: 178, y: 130, width: 28, height: 20 };
            expect(pipes.checkCollisionWithBird(birdBounds)).toBe(true);
        });

        it('détecte une collision avec un tuyau du bas', () => {
            pipes.bottomPipes.push({ x: 200, y: 400 });
            const birdBounds = { x: 178, y: 410, width: 28, height: 20 };
            expect(pipes.checkCollisionWithBird(birdBounds)).toBe(true);
        });

        it('rejette l’absence de chevauchement', () => {
            pipes.topPipes.push({ x: 200, y: 80 });
            const birdBounds = { x: 178, y: 200, width: 28, height: 20 };
            expect(pipes.checkCollisionWithBird(birdBounds)).toBe(false);
        });
    });

    describe('isBirdInGap', () => {
        const gapBounds = { x: 178, y: 130, width: 28, height: 20 };

        it('détecte l’oiseau dans le gap vertical', () => {
            pipes.topPipes.push({ x: 200, y: 120 });
            pipes.bottomPipes.push({ x: 200, y: 232 });
            expect(pipes.isBirdInGap(gapBounds)).toBe(true);
            expect(pipes.isBirdInGap({ ...gapBounds, y: 100 })).toBe(false);
        });
    });

    describe('update', () => {
        it('fait défiler et spawn une paire après pipeInterval', () => {
            pipes.pipeInterval = 2;
            pipes.pipeSpeed = 10;
            pipes._autoSpawnEnabled = true;
            pipes.topPipes.push({ x: 100, y: 150, scored: false });
            pipes.bottomPipes.push({ x: 100, y: 300, scored: false });
            pipes.update(1);
            expect(pipes.topPipes[0].x).toBe(90);
            pipes.update(1);
            expect(pipes.topPipes.length).toBeGreaterThan(1);
        });

        it('n’auto-spawn pas avant le premier spawn manuel', () => {
            pipes.pipeInterval = 2;
            pipes._autoSpawnEnabled = false;
            pipes.update(1);
            pipes.update(1);
            expect(pipes.topPipes).toHaveLength(0);
            pipes.spawn();
            expect(pipes.topPipes).toHaveLength(1);
        });
    });

    describe('reset', () => {
        it('vide les tuyaux actifs', () => {
            pipes.spawn();
            expect(pipes.topPipes.length).toBeGreaterThan(0);
            pipes.reset();
            expect(pipes.topPipes).toHaveLength(0);
            expect(pipes._spawnCounter).toBe(0);
        });
    });

    describe('setDifficulty', () => {
        it('met à jour vitesse et écart des tuyaux', () => {
            pipes.setDifficulty('hard');
            const hard = GAME_CONFIG.getDifficulty('hard');
            expect(pipes.pipeSpeed).toBe(hard.speed);
            expect(pipes.pipeGap).toBe(hard.gap);
        });
    });

    describe('applyRoundDifficulty', () => {
        it('applique vitesse, gap et intervalle d’une config de manche', () => {
            pipes.applyRoundDifficulty({ speed: 3.1, gap: 100, pipeInterval: 70 });
            expect(pipes.pipeSpeed).toBe(3.1);
            expect(pipes.pipeGap).toBe(100);
            expect(pipes.pipeInterval).toBe(70);
            pipes.applySpeedForScore(10);
            expect(pipes.pipeSpeed).toBeGreaterThan(3.1);
        });
    });

    describe('smoothGapY', () => {
        it('limite l’écart vertical entre gaps consécutifs', () => {
            expect(smoothGapY(200, 150, 80, 48, 400)).toBe(200);
            expect(smoothGapY(300, 150, 80, 48, 400)).toBe(230);
        });
    });

    describe('applySpeedForScore', () => {
        it('accélère légèrement tous les 10 points', () => {
            pipes.setDifficulty('normal');
            const base = pipes.pipeSpeed;
            pipes.applySpeedForScore(10);
            expect(pipes.pipeSpeed).toBeGreaterThan(base);
            pipes.applySpeedForScore(0);
            expect(pipes.pipeSpeed).toBe(base);
        });

        it('plafonne l’accélération après score 50', () => {
            pipes.setDifficulty('normal');
            const base = pipes.pipeSpeed;
            pipes.applySpeedForScore(50);
            const at50 = pipes.pipeSpeed;
            pipes.applySpeedForScore(100);
            expect(pipes.pipeSpeed).toBe(at50);
            expect(at50).toBeCloseTo(base * 1.15);
        });

        it('resserre le gap physique après 20 points', () => {
            pipes.applyRoundDifficulty({ speed: 2.7, gap: 112, pipeInterval: 76 });
            pipes.applySpeedForScore(19);
            expect(pipes.pipeGap).toBe(112);
            pipes.applySpeedForScore(30);
            expect(pipes.pipeGap).toBe(112 - GAME_CONFIG.round.gapTightenStep);
            expect(maxGapDeltaForScore(30)).toBe(
                GAME_CONFIG.pipes.maxGapDelta - GAME_CONFIG.round.gapTightenStep
            );
        });
    });

    describe('setDailySeed', () => {
        it('ignore les gaps scriptés en mode daily', () => {
            pipes.setDailySeed(424242);
            pipes.pipeGap = 112;
            const gap1 = pipes._resolveGapY();
            const gap2 = pipes._resolveGapY();
            expect(gap1).not.toBe(getScriptedPipeGapY(0, 112));
            expect(gap2).not.toBe(getScriptedPipeGapY(1, 112));
        });

        it('produit la même séquence RNG daily', () => {
            pipes.setDailySeed(424242);
            pipes.pipeGap = 112;
            const gap1 = pipes._resolveGapY();
            const gap2 = pipes._resolveGapY();

            const other = new Pipes(scene);
            other.pipeGap = 112;
            other.setDailySeed(424242);
            expect(other._resolveGapY()).toBe(gap1);
            expect(other._resolveGapY()).toBe(gap2);
            expect(gap1).not.toBe(gap2);
        });
    });

    describe('setGapJitterSeed', () => {
        it('varie les gaps scriptés sans casser la reproductibilité', () => {
            pipes.pipeGap = 112;
            pipes.setGapJitterSeed(777);
            const gapA = pipes._resolveGapY();
            pipes.reset();
            pipes.pipeGap = 112;
            pipes.setGapJitterSeed(777);
            const gapB = pipes._resolveGapY();
            expect(gapA).toBe(gapB);
            expect(gapA).not.toBe(getScriptedPipeGapY(0, 112));
        });
    });
});
