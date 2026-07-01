import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    getVolume,
    setVolume,
    isMuted,
    setMuted,
    cycleSoundLevel,
    formatSoundLabel,
    VOLUME_STEPS,
} from '../src/audioVolume.js';

describe('audioVolume', () => {
    let store;

    beforeEach(() => {
        store = {};
        vi.stubGlobal('localStorage', {
            getItem: (k) => store[k] ?? null,
            setItem: (k, v) => { store[k] = v; },
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('cycleSoundLevel parcourt les paliers de volume', () => {
        setMuted(false);
        setVolume(1);
        cycleSoundLevel();
        expect(getVolume()).toBe(0.5);
        cycleSoundLevel();
        expect(getVolume()).toBe(0.25);
        cycleSoundLevel();
        expect(isMuted()).toBe(true);
        expect(getVolume()).toBe(0);
        cycleSoundLevel();
        expect(getVolume()).toBe(VOLUME_STEPS[0]);
        expect(isMuted()).toBe(false);
    });

    it('formatSoundLabel reflète l’état audio', () => {
        setVolume(1);
        setMuted(false);
        expect(formatSoundLabel(true)).toBe('100 %');
        setVolume(0.5);
        expect(formatSoundLabel(true)).toBe('50 %');
        setMuted(true);
        expect(formatSoundLabel(true)).toBe('OFF');
        expect(formatSoundLabel(false)).toBe('indisponible');
    });
});
