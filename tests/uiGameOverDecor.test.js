import { describe, it, expect, vi } from 'vitest';
import { shade, drawPlaqueCorners, drawDivider, spawnConfetti } from '../src/uiGameOverDecor.js';
import { createBaseScene } from './helpers/phaserMock.js';

vi.mock('../src/motion.js', () => ({
    sceneTween: vi.fn((scene, config) => {
        config.onComplete?.();
    }),
    prefersReducedMotion: vi.fn(() => false),
}));

describe('uiGameOverDecor', () => {
    it('shade assombrit une couleur hex', () => {
        expect(shade(0xffffff, 0.5)).toBe(0x7f7f7f);
    });

    it('drawPlaqueCorners dessine les coins', () => {
        const g = {
            fillStyle: vi.fn(),
            fillRect: vi.fn(),
        };
        drawPlaqueCorners(g, { x: 10, y: 20, w: 200, h: 100 });
        expect(g.fillStyle).toHaveBeenCalled();
        expect(g.fillRect).toHaveBeenCalled();
    });

    it('drawDivider crée une ligne', () => {
        const scene = createBaseScene();
        const line = drawDivider(scene, 144, 200, 180, 50);
        expect(line).toBeTruthy();
        expect(scene.add.rectangle).toHaveBeenCalled();
    });

    it('spawnConfetti crée 12 rectangles animés', () => {
        const scene = createBaseScene();
        const elements = [];
        spawnConfetti(scene, 144, 80, elements);
        expect(elements).toHaveLength(12);
        expect(scene.add.rectangle).toHaveBeenCalledTimes(12);
    });
});
