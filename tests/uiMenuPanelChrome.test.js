import { describe, it, expect, vi } from 'vitest';
import { GAME_CONFIG } from '../src/config.js';
import { DESIGN_TOKENS, hexVersPhaser } from '../src/designTokens.js';
import { MIN_TOUCH } from '../src/ui/shared/uiLayout.js';
import {
    buildPanelPillButton,
    buildStyledPanelBackdrop,
    drawPanelPillButton,
    PANEL_SHELL_RADIUS,
} from '../src/ui/menu/uiMenuPanelChrome.js';
import { createBaseScene } from './helpers/phaserMock.js';

describe('uiMenuPanelChrome', () => {
    it('drawPanelPillButton trace un rectangle arrondi', () => {
        const g = {
            clear: vi.fn(),
            fillStyle: vi.fn(),
            fillRoundedRect: vi.fn(),
            lineStyle: vi.fn(),
            strokeRoundedRect: vi.fn(),
        };
        drawPanelPillButton(g, 100, 50, 80, 44, 0xff0000, 0.9, 0x00ff00, 0.5, 8);
        expect(g.clear).toHaveBeenCalled();
        expect(g.fillRoundedRect).toHaveBeenCalled();
        expect(g.strokeRoundedRect).toHaveBeenCalled();
    });

    it('buildStyledPanelBackdrop crée frame + hit absorbant', () => {
        const scene = createBaseScene();
        const panel = { panelTop: 96, panelH: 200, w: 260 };
        const backdrop = buildStyledPanelBackdrop(scene, panel, {
            fill: DESIGN_TOKENS.fondPanneauGameOver,
            stroke: DESIGN_TOKENS.contourOptions,
        });
        expect(backdrop.frame).toBeDefined();
        expect(backdrop.hit).toBeDefined();
        expect(backdrop.setVisible).toBeTypeOf('function');
        backdrop.setVisible(true);
        expect(backdrop.frame.setVisible).toHaveBeenCalledWith(true);
        const downHandler = backdrop.hit.on.mock.calls.find(([evt]) => evt === 'pointerdown')?.[1];
        const event = { stopPropagation: vi.fn() };
        downHandler?.(null, null, null, event);
        expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('buildPanelPillButton appelle onToggle au clic', () => {
        const scene = createBaseScene();
        const elements = [];
        const onToggle = vi.fn();
        const { hit } = buildPanelPillButton(scene, elements, {
            cx: GAME_CONFIG.centerX,
            cy: 200,
            width: 72,
            depth: 10,
            color: hexVersPhaser(DESIGN_TOKENS.boutonMenu),
            stroke: hexVersPhaser(DESIGN_TOKENS.boutonOptionsStroke),
            labelText: 'REGL',
            labelStroke: DESIGN_TOKENS.contourOptions,
            onToggle,
        });
        expect(elements.length).toBeGreaterThanOrEqual(3);
        const downHandler = hit.on.mock.calls.find(([evt]) => evt === 'pointerdown')?.[1];
        downHandler?.();
        expect(onToggle).toHaveBeenCalled();
    });

    it('buildPanelPillButton respecte MIN_TOUCH sur la hit zone', () => {
        const scene = createBaseScene();
        const elements = [];
        buildPanelPillButton(scene, elements, {
            cx: 144,
            cy: 120,
            width: 40,
            depth: 5,
            color: 0xffffff,
            stroke: 0x000000,
            labelText: 'OK',
            labelStroke: '#000',
            onToggle: vi.fn(),
        });
        const rectArgs = scene.add.rectangle.mock.calls.at(-1);
        expect(rectArgs[2]).toBe(MIN_TOUCH);
        expect(rectArgs[3]).toBe(MIN_TOUCH);
    });

    it('PANEL_SHELL_RADIUS est documenté pour les panneaux', () => {
        expect(PANEL_SHELL_RADIUS).toBe(10);
    });
});
