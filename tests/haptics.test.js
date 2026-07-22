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
        const { hapticHeavy } = await import('../src/haptics.js');
        hapticHeavy();
        expect(vibrate).toHaveBeenCalledWith([40, 24, 40]);
    });

    it('ignore les erreurs vibrate', async () => {
        vi.stubGlobal('navigator', {
            vibrate: () => {
                throw new Error('blocked');
            },
        });
        const { hapticLight, hapticMedium, hapticHeavy } = await import('../src/haptics.js');
        expect(() => hapticLight()).not.toThrow();
        expect(() => hapticMedium()).not.toThrow();
        expect(() => hapticHeavy()).not.toThrow();
    });

    it('vibre même si le son est muet', async () => {
        const vibrate = vi.fn();
        vi.stubGlobal('navigator', { vibrate });
        vi.stubGlobal('localStorage', {
            getItem: (key) => (String(key).includes('muted') ? '1' : null),
            setItem: () => {},
        });
        const { hapticLight, hapticMedium, hapticHeavy } = await import('../src/haptics.js');
        hapticLight();
        hapticMedium();
        hapticHeavy();
        expect(vibrate).toHaveBeenCalledWith(12);
        expect(vibrate).toHaveBeenCalledWith(28);
        expect(vibrate).toHaveBeenCalledWith([40, 24, 40]);
    });

    it('ne vibre pas si prefers-reduced-motion', async () => {
        const vibrate = vi.fn();
        vi.stubGlobal('navigator', { vibrate });
        vi.stubGlobal('matchMedia', () => ({ matches: true }));
        const { hapticLight } = await import('../src/haptics.js');
        hapticLight();
        expect(vibrate).not.toHaveBeenCalled();
    });

    it('ne vibre pas si option vibration désactivée', async () => {
        const vibrate = vi.fn();
        vi.stubGlobal('navigator', { vibrate });
        vi.stubGlobal('localStorage', {
            getItem: (key) => (String(key).includes('haptics') ? '0' : null),
            setItem: () => {},
        });
        const { hapticLight, hapticMedium, isHapticsEnabled } = await import('../src/haptics.js');
        expect(isHapticsEnabled()).toBe(false);
        hapticLight();
        hapticMedium();
        expect(vibrate).not.toHaveBeenCalled();
    });

    it('reduced-motion prime sur l’option vibration ON', async () => {
        const vibrate = vi.fn();
        vi.stubGlobal('navigator', { vibrate });
        vi.stubGlobal('matchMedia', () => ({ matches: true }));
        vi.stubGlobal('localStorage', {
            getItem: (key) => (String(key).includes('haptics') ? '1' : null),
            setItem: () => {},
        });
        const { hapticLight } = await import('../src/haptics.js');
        hapticLight();
        expect(vibrate).not.toHaveBeenCalled();
    });

    it('toggleHaptics persiste et bascule', async () => {
        const store = new Map();
        vi.stubGlobal('localStorage', {
            getItem: (key) => (store.has(key) ? store.get(key) : null),
            setItem: (key, value) => store.set(key, value),
        });
        const { isHapticsEnabled, toggleHaptics, setHapticsEnabled } =
            await import('../src/haptics.js');
        expect(isHapticsEnabled()).toBe(true);
        expect(toggleHaptics()).toBe(false);
        expect(isHapticsEnabled()).toBe(false);
        setHapticsEnabled(true);
        expect(isHapticsEnabled()).toBe(true);
    });
});
