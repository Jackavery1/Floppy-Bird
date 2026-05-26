import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Pipes } from '../src/pipes.js';
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
            pipes.topPipes.push({ x: 100, y: 150, scored: false });
            pipes.bottomPipes.push({ x: 100, y: 300, scored: false });
            pipes.update(1);
            expect(pipes.topPipes[0].x).toBe(90);
            pipes.update(1);
            expect(pipes.topPipes.length).toBeGreaterThan(1);
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

        it('propage la difficulté à l’oiseau de la scène', () => {
            const applyDifficulty = vi.fn();
            scene.bird = { applyDifficulty };
            pipes.setDifficulty('easy');
            const easy = GAME_CONFIG.getDifficulty('easy');
            expect(applyDifficulty).toHaveBeenCalledWith(easy);
        });
    });
});
