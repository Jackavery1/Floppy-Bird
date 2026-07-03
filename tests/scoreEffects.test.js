import { describe, it, expect, vi, beforeEach } from 'vitest';
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
        scene = createMockScene();
        effects = new ScoreEffects(scene);
    });

    it('pré-alloue popups et étoiles', () => {
        expect(scene.add.text).toHaveBeenCalledTimes(3);
        expect(scene.add.sprite).toHaveBeenCalledTimes(12);
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
