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
});
