import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ScorePopupPool } from '../src/ScorePopupPool.js';

function createMockScene() {
    const tweens = [];
    return {
        tweens: {
            add: vi.fn(config => tweens.push(config)),
        },
        add: {
            text: vi.fn(function () {
                const popup = {
                    active: false,
                    setDepth: vi.fn(),
                    setVisible: vi.fn(),
                    setPosition: vi.fn(),
                    setAlpha: vi.fn(),
                    destroy: vi.fn(),
                };
                popup.setActive = vi.fn(function (v) {
                    popup.active = v;
                    return popup;
                });
                return popup;
            }),
        },
        _tweens: tweens,
    };
}

describe('ScorePopupPool', () => {
    let scene;
    let pool;

    beforeEach(() => {
        scene = createMockScene();
        pool = new ScorePopupPool(scene, 2);
    });

    it('pré-alloue le pool demandé', () => {
        expect(scene.add.text).toHaveBeenCalledTimes(2);
        expect(pool._pool).toHaveLength(2);
    });

    it('active un popup disponible au show', () => {
        pool.show(120, 300);
        const active = pool._pool.find(t => t.active);
        expect(active).toBeDefined();
        expect(active.setVisible).toHaveBeenCalledWith(true);
        expect(scene.tweens.add).toHaveBeenCalled();
    });

    it('désactive le popup à la fin du tween', () => {
        pool.show(120, 300);
        const config = scene._tweens[0];
        const popup = pool._pool.find(t => t.active);
        config.onComplete();
        expect(popup.setVisible).toHaveBeenCalledWith(false);
        expect(popup.setActive).toHaveBeenCalledWith(false);
    });

    it('vide le pool au destroy', () => {
        pool._pool.forEach(t => expect(t.destroy).toBeDefined());
        pool.destroy();
        expect(pool._pool).toHaveLength(0);
    });
});
