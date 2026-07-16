import { describe, it, expect, vi } from 'vitest';
import { drawGameOverPanelFrame } from '../src/ui/shared/uiGameOverChrome.js';

describe('uiGameOverPanel', () => {
    it('drawGameOverPanelFrame dessine le panneau avec opacités configurables', () => {
        const graphics = {
            fillStyle: vi.fn(),
            fillRoundedRect: vi.fn(),
            lineStyle: vi.fn(),
            strokeRoundedRect: vi.fn(),
        };
        const P = { x: 10, y: 20, w: 100, h: 80, radius: 8 };

        drawGameOverPanelFrame(graphics, P, {
            fillAlpha: 0.82,
            strokeAlpha: 0.55,
            innerStrokeAlpha: 0,
        });

        expect(graphics.fillStyle).toHaveBeenCalledWith(expect.any(Number), 0.82);
        expect(graphics.fillRoundedRect).toHaveBeenCalledWith(10, 20, 100, 80, 8);
        expect(graphics.strokeRoundedRect).toHaveBeenCalledTimes(1);
    });
});
