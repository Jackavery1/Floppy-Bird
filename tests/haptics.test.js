import { describe, it, expect, vi, afterEach } from 'vitest';

describe('haptics', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('vibre légèrement au saut si disponible', async () => {
        const vibrate = vi.fn();
        vi.stubGlobal('navigator', { vibrate });
        vi.resetModules();
        const { hapticLight } = await import('../src/haptics.js');
        hapticLight();
        expect(vibrate).toHaveBeenCalledWith(12);
    });

    it('ne lève pas si vibrate absent', async () => {
        vi.stubGlobal('navigator', {});
        vi.resetModules();
        const { hapticMedium } = await import('../src/haptics.js');
        expect(() => hapticMedium()).not.toThrow();
    });

    it('vibre fortement à la mort si disponible', async () => {
        const vibrate = vi.fn();
        vi.stubGlobal('navigator', { vibrate });
        vi.resetModules();
        const { hapticMedium } = await import('../src/haptics.js');
        hapticMedium();
        expect(vibrate).toHaveBeenCalledWith(28);
    });

    it('ignore les erreurs vibrate', async () => {
        vi.stubGlobal('navigator', {
            vibrate: () => {
                throw new Error('blocked');
            },
        });
        vi.resetModules();
        const { hapticLight, hapticMedium } = await import('../src/haptics.js');
        expect(() => hapticLight()).not.toThrow();
        expect(() => hapticMedium()).not.toThrow();
    });
});
