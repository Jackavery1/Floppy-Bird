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
});
