import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DESIGN_TOKENS } from '../src/designTokens.js';

vi.mock('../src/backgroundPeriod.js', () => ({
    getBackgroundPeriod: vi.fn(() => 'night'),
}));

import { getBackgroundPeriod } from '../src/backgroundPeriod.js';
import { ScoreEffects } from '../src/scoreEffects.js';

function createMockScene() {
    const tweens = [];
    const makeText = () => {
        const popup = {
            active: false,
            setDepth: vi.fn().mockReturnThis(),
            setVisible: vi.fn().mockReturnThis(),
            setPosition: vi.fn().mockReturnThis(),
            setAlpha: vi.fn().mockReturnThis(),
            setStyle: vi.fn().mockReturnThis(),
            setActive: vi.fn(function (v) {
                popup.active = v;
                return popup;
            }),
            destroy: vi.fn(),
        };
        return popup;
    };
    const makeSprite = () => {
        const star = {
            active: false,
            setDepth: vi.fn().mockReturnThis(),
            setVisible: vi.fn().mockReturnThis(),
            setPosition: vi.fn().mockReturnThis(),
            setAlpha: vi.fn().mockReturnThis(),
            setScale: vi.fn().mockReturnThis(),
            setActive: vi.fn(function (v) {
                star.active = v;
                return star;
            }),
            destroy: vi.fn(),
        };
        return star;
    };
    return {
        tweens: { add: vi.fn((config) => tweens.push(config)) },
        add: {
            text: vi.fn(makeText),
            sprite: vi.fn(makeSprite),
        },
        _tweens: tweens,
    };
}

describe('ScoreEffects', () => {
    let scene;
    let effects;

    beforeEach(() => {
        getBackgroundPeriod.mockReturnValue('night');
        scene = createMockScene();
        effects = new ScoreEffects(scene);
    });

    it('pré-alloue popups et étoiles', () => {
        expect(scene.add.text).toHaveBeenCalledTimes(3);
        expect(scene.add.sprite).toHaveBeenCalledTimes(12);
        const style = scene.add.text.mock.calls[0][3];
        expect(style.stroke).toBe(DESIGN_TOKENS.contourHud);
        expect(style.fill).toBe(DESIGN_TOKENS.accentTitre);
    });

    it('applique le style jour AA au show', () => {
        getBackgroundPeriod.mockReturnValue('day');
        effects.show(100, 200);
        const popup = effects._popups[0];
        expect(popup.setStyle).toHaveBeenCalledWith(
            expect.objectContaining({
                fill: DESIGN_TOKENS.accentTitreJour,
                stroke: DESIGN_TOKENS.contourHud,
                strokeThickness: 6,
            })
        );
    });

    it('lance les tweens au show', () => {
        effects.show(100, 200);
        expect(scene.tweens.add).toHaveBeenCalled();
        expect(scene.tweens.add.mock.calls.length).toBeGreaterThanOrEqual(5);
    });

    it('nettoie au destroy', () => {
        effects.destroy();
        expect(effects._popups).toHaveLength(0);
        expect(effects._stars).toHaveLength(0);
    });
});
