import { describe, it, expect, vi, afterEach } from 'vitest';

describe('motion', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('prefersReducedMotion reflète matchMedia', async () => {
        vi.stubGlobal(
            'matchMedia',
            vi.fn(() => ({ matches: true }))
        );
        const { prefersReducedMotion } = await import('../src/motion.js');
        expect(prefersReducedMotion()).toBe(true);
    });

    it('sceneTween force duration 0 si reduced motion', async () => {
        vi.stubGlobal(
            'matchMedia',
            vi.fn(() => ({ matches: true }))
        );
        const add = vi.fn();
        const scene = { tweens: { add } };
        const { sceneTween } = await import('../src/motion.js');
        sceneTween(scene, { targets: {}, duration: 400, repeat: 2 });
        expect(add).toHaveBeenCalledWith(expect.objectContaining({ duration: 0, repeat: 0 }));
    });

    it('sceneTween applique l’état final et onComplete si reduced motion', async () => {
        vi.stubGlobal(
            'matchMedia',
            vi.fn(() => ({ matches: true }))
        );
        const onComplete = vi.fn();
        const target = { setAlpha: vi.fn(), setY: vi.fn() };
        const add = vi.fn();
        const scene = { tweens: { add } };
        const { sceneTween } = await import('../src/motion.js');
        sceneTween(scene, {
            targets: target,
            alpha: { from: 1, to: 0 },
            y: 72,
            duration: 1200,
            onComplete,
        });
        expect(target.setAlpha).toHaveBeenCalledWith(0);
        expect(target.setY).toHaveBeenCalledWith(72);
        expect(onComplete).toHaveBeenCalled();
    });

    it('sceneTween applique scale finale si reduced motion', async () => {
        vi.stubGlobal(
            'matchMedia',
            vi.fn(() => ({ matches: true }))
        );
        const target = { setScale: vi.fn() };
        const scene = { tweens: { add: vi.fn() } };
        const { sceneTween } = await import('../src/motion.js');
        sceneTween(scene, {
            targets: target,
            scaleX: { from: 0.85, to: 1.05 },
            scaleY: { from: 0.85, to: 1.05 },
            duration: 180,
            repeat: 1,
        });
        expect(target.setScale).toHaveBeenCalledWith(1.05, 1.05);
    });

    it('sceneTween garde alpha visible pour pulse yoyo si reduced motion', async () => {
        vi.stubGlobal(
            'matchMedia',
            vi.fn(() => ({ matches: true }))
        );
        const target = { setAlpha: vi.fn() };
        const scene = { tweens: { add: vi.fn() } };
        const { sceneTween } = await import('../src/motion.js');
        sceneTween(scene, {
            targets: target,
            alpha: 0,
            yoyo: true,
            repeat: -1,
            duration: 400,
        });
        expect(target.setAlpha).toHaveBeenCalledWith(1);
    });

    it('sceneCameraShake ignore si reduced motion', async () => {
        vi.stubGlobal(
            'matchMedia',
            vi.fn(() => ({ matches: true }))
        );
        const shake = vi.fn();
        const { sceneCameraShake } = await import('../src/motion.js');
        sceneCameraShake({ shake }, 200, 0.015);
        expect(shake).not.toHaveBeenCalled();
    });
});
