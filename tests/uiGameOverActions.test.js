import { describe, it, expect, vi } from 'vitest';
import {
    buildGameOverActions,
    animateGameOverReveal,
} from '../src/ui/gameOver/uiGameOverActions.js';
import { createBaseScene } from './helpers/phaserMock.js';

vi.mock('../src/motion.js', () => ({
    sceneTween: vi.fn((_scene, config) => {
        config.onUpdate?.();
        config.onComplete?.();
    }),
    prefersReducedMotion: vi.fn(() => false),
}));

vi.mock('../src/device.js', () => ({
    gameOverRestartLabel: vi.fn(() => 'REJOUER'),
}));

describe('uiGameOverActions', () => {
    it('buildGameOverActions crée les boutons rejouer et menu', () => {
        const scene = createBaseScene({
            handlePrimaryAction: vi.fn(),
            returnToMenu: vi.fn(),
        });
        const ui = {
            drawGameOverRestartButton: vi.fn(),
            drawGameOverMenuButton: vi.fn(),
        };
        const P = { x: 72, y: 120, w: 144, h: 200 };

        const elements = buildGameOverActions(
            scene,
            ui,
            144,
            (offset) => 100 + offset,
            P,
            {
                isDaily: false,
                fadeIn: true,
                finalScore: 12,
                isNewRecord: false,
            },
            null
        );

        expect(elements.length).toBeGreaterThan(0);
        expect(ui._gameOverRestartBtnY).toBeDefined();
        expect(ui._gameOverMenuBtnY).toBeDefined();
        expect(ui.drawGameOverRestartButton).toHaveBeenCalled();
        expect(ui.drawGameOverMenuButton).toHaveBeenCalled();
    });

    it('animateGameOverReveal anime le score jusqu’à la valeur finale', () => {
        const scene = createBaseScene();
        const scoreText = { setText: vi.fn(), setAlpha: vi.fn() };
        const elements = [{ setAlpha: vi.fn() }];

        animateGameOverReveal(scene, elements, scoreText, 7, false, 144, { y: 100 });

        expect(elements[0].setAlpha).toHaveBeenCalledWith(0);
        expect(scoreText.setText).toHaveBeenCalledWith('7');
    });
});
