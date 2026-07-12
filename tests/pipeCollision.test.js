import { describe, it, expect } from 'vitest';
import { GAME_CONFIG } from '../src/config.js';
import {
    pipeCollider,
    collidesWithPipeGroup,
    isBirdInPipeGap,
    birdVerticallyInGap,
    birdClearedPipeForScore,
} from '../src/pipeCollision.js';

describe('pipeCollision', () => {
    describe('pipeCollider', () => {
        it('définit le collider du tuyau haut', () => {
            const col = pipeCollider({ x: 200, y: 120 }, 'top', 28);
            expect(col).toEqual({ x: 186, y: 0, width: 28, height: 120 });
        });

        it('définit le collider du tuyau bas jusqu’au sol', () => {
            const col = pipeCollider({ x: 200, y: 350 }, 'bottom', 28);
            expect(col).toEqual({
                x: 186,
                y: 350,
                width: 28,
                height: GAME_CONFIG.height - 350,
            });
        });
    });

    describe('collidesWithPipeGroup', () => {
        const pipes = [{ x: 200, y: 150 }];

        it('détecte un chevauchement', () => {
            const bird = { x: 186, y: 130, width: 28, height: 20 };
            expect(collidesWithPipeGroup(pipes, 'top', bird, 28)).toBe(true);
        });

        it('rejette l’absence de chevauchement', () => {
            const bird = { x: 186, y: 200, width: 28, height: 20 };
            expect(collidesWithPipeGroup(pipes, 'top', bird, 28)).toBe(false);
        });
    });

    describe('birdVerticallyInGap', () => {
        it('accepte le centre ou la hitbox entière', () => {
            expect(birdVerticallyInGap({ y: 130, height: 20 }, 120, 232)).toBe(true);
            expect(birdVerticallyInGap({ y: 121, height: 18 }, 120, 232)).toBe(true);
            expect(birdVerticallyInGap({ y: 100, height: 20 }, 120, 232)).toBe(false);
        });
    });

    describe('isBirdInPipeGap', () => {
        const topPipes = [{ x: 200, y: 120 }];
        const bottomPipes = [{ x: 200, y: 232 }];
        const inGap = { x: 186, y: 130, width: 28, height: 20 };

        it('valide l’oiseau dont le centre est dans le corridor', () => {
            expect(isBirdInPipeGap(inGap, topPipes, bottomPipes, 28)).toBe(true);
        });

        it('accorde le coyote si le centre est dans le gap malgré un frôlement', () => {
            const clipping = { x: 186, y: 222, width: 28, height: 20 };
            expect(isBirdInPipeGap(clipping, topPipes, bottomPipes, 28)).toBe(true);
        });

        it('accorde le coyote si la hitbox entière est dans le gap', () => {
            const boundsOnly = { x: 186, y: 121, width: 28, height: 18 };
            expect(isBirdInPipeGap(boundsOnly, topPipes, bottomPipes, 28)).toBe(true);
        });

        it('rejette un oiseau hors du gap vertical', () => {
            expect(isBirdInPipeGap({ ...inGap, y: 100 }, topPipes, bottomPipes, 28)).toBe(false);
        });

        it('rejette un oiseau hors de la colonne horizontale', () => {
            expect(isBirdInPipeGap({ ...inGap, x: 120 }, topPipes, bottomPipes, 28)).toBe(false);
        });

        it('ignore les paires incomplètes', () => {
            expect(isBirdInPipeGap(inGap, topPipes, [], 28)).toBe(false);
        });
    });

    describe('birdClearedPipeForScore', () => {
        const bird = {
            getBounds: () => ({ x: 121, y: 0, width: 22, height: 16 }),
        };

        it('valide le dépassement complet de la hitbox', () => {
            expect(birdClearedPipeForScore(bird, 100, 40)).toBe(true);
        });

        it('rejette tant que le bord gauche n’a pas dépassé le tuyau', () => {
            const early = {
                getBounds: () => ({ x: 120, y: 0, width: 22, height: 16 }),
            };
            expect(birdClearedPipeForScore(early, 100, 40)).toBe(false);
        });
    });
});
