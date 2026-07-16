import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';

describe('haptics', () => {
    beforeEach(() => {
        vi.stubGlobal('matchMedia', () => ({ matches: false }));
        vi.stubGlobal('localStorage', {
            getItem: () => null,
            setItem: () => {},
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.resetModules();
    });

    it('vibre légèrement au saut si disponible', async () => {
        const vibrate = vi.fn();
        vi.stubGlobal('navigator', { vibrate });
        const { hapticLight } = await import('../src/haptics.js');
        hapticLight();
        expect(vibrate).toHaveBeenCalledWith(12);
    });

    it('ne lève pas si vibrate absent', async () => {
        vi.stubGlobal('navigator', {});
        const { hapticMedium } = await import('../src/haptics.js');
        expect(() => hapticMedium()).not.toThrow();
    });

    it('vibre fortement à la mort si disponible', async () => {
        const vibrate = vi.fn();
        vi.stubGlobal('navigator', { vibrate });
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
        const { hapticLight, hapticMedium } = await import('../src/haptics.js');
        expect(() => hapticLight()).not.toThrow();
        expect(() => hapticMedium()).not.toThrow();
    });

    it('vibre même si le son est muet', async () => {
        const vibrate = vi.fn();
        vi.stubGlobal('navigator', { vibrate });
        vi.stubGlobal('localStorage', {
            getItem: (key) => (String(key).includes('muted') ? '1' : null),
            setItem: () => {},
        });
        const { hapticLight, hapticMedium } = await import('../src/haptics.js');
        hapticLight();
        hapticMedium();
        expect(vibrate).toHaveBeenCalledWith(12);
        expect(vibrate).toHaveBeenCalledWith(28);
    });

    it('ne vibre pas si prefers-reduced-motion', async () => {
        const vibrate = vi.fn();
        vi.stubGlobal('navigator', { vibrate });
        vi.stubGlobal('matchMedia', () => ({ matches: true }));
        const { hapticLight } = await import('../src/haptics.js');
        hapticLight();
        expect(vibrate).not.toHaveBeenCalled();
    });
});
