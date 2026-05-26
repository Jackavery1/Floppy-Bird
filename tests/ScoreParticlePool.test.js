import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ScoreParticlePool } from '../src/ScoreParticlePool.js';

function createMockScene() {
    const tweens = [];
    return {
        tweens: {
            add: vi.fn(config => tweens.push(config)),
        },
        add: {
            sprite: vi.fn(function () {
                const star = {
                    active: false,
                    setDepth: vi.fn(),
                    setVisible: vi.fn(),
                    setPosition: vi.fn(),
                    setAlpha: vi.fn(),
                    setScale: vi.fn(),
                    destroy: vi.fn(),
                };
                star.setActive = vi.fn(function (v) {
                    star.active = v;
                    return star;
                });
                return star;
            }),
        },
        _tweens: tweens,
    };
}

describe('ScoreParticlePool', () => {
    let scene;
    let pool;

    beforeEach(() => {
        scene = createMockScene();
        pool = new ScoreParticlePool(scene, 4);
    });

    it('pré-alloue 4 étoiles', () => {
        expect(scene.add.sprite).toHaveBeenCalledTimes(4);
    });

    it('active 4 particules par show', () => {
        pool.show(100, 200);
        expect(pool._pool.filter(s => s.active).length).toBe(4);
        expect(scene.tweens.add).toHaveBeenCalledTimes(4);
    });

    it('recycle une particule après le tween', () => {
        pool.show(100, 200);
        scene._tweens[0].onComplete();
        expect(pool._pool[0].setVisible).toHaveBeenCalledWith(false);
    });
});
