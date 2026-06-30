import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Pipes, smoothGapY } from '../src/pipes.js';
import { GAME_CONFIG } from '../src/config.js';

function createMockScene() {
    const scene = {
        bird: null,
        add: {
            sprite: vi.fn(() => ({
                x: 0,
                y: 0,
                scored: false,
                setDisplaySize: vi.fn(),
                setOrigin: vi.fn(),
                setDepth: vi.fn(),
                setTexture: vi.fn(),
                setActive: vi.fn(function () { return this; }),
                setVisible: vi.fn(function () { return this; }),
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
    });

    describe('setDailySeed', () => {
        it('produit la même séquence de gaps', () => {
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
});
