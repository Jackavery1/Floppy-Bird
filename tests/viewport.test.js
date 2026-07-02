import { describe, it, expect, vi } from 'vitest';
import { computeLetterboxSize, readSafeAreaInsets, getViewportDimensions, getLetterboxViewport } from '../src/viewport.js';

describe('viewport', () => {
    it('letterbox portrait mobile', () => {
        const { width, height } = computeLetterboxSize(390, 844, 288, 512);
        expect(width).toBe(390);
        expect(height).toBe(Math.floor(390 / (288 / 512)));
    });

    it('letterbox desktop large', () => {
        const { width, height } = computeLetterboxSize(1280, 720, 288, 512);
        expect(height).toBe(720);
        expect(width).toBe(Math.floor(720 * (288 / 512)));
    });

    it('letterbox tient compte des safe-area insets', () => {
        const insets = { top: 20, right: 10, bottom: 20, left: 10 };
        const { width, height } = computeLetterboxSize(390, 844, 288, 512, insets);
        const availW = 390 - 20;
        expect(width).toBe(availW);
        expect(height).toBe(Math.floor(availW / (288 / 512)));
    });

    it('readSafeAreaInsets retourne des zéros sans document', () => {
        expect(readSafeAreaInsets()).toEqual({ top: 0, right: 0, bottom: 0, left: 0 });
    });

    it('getViewportDimensions expose visualViewport offsets', () => {
        vi.stubGlobal('window', {
            visualViewport: { width: 390, height: 400, offsetTop: 12, offsetLeft: 4 },
        });
        expect(getViewportDimensions()).toEqual({
            width: 390,
            height: 400,
            offsetTop: 12,
            offsetLeft: 4,
        });
        vi.unstubAllGlobals();
    });

    it('getLetterboxViewport utilise le client du body', () => {
        vi.stubGlobal('window', { visualViewport: { offsetTop: 5, offsetLeft: 2 } });
        vi.stubGlobal('document', {
            body: { clientWidth: 350, clientHeight: 700 },
        });
        expect(getLetterboxViewport()).toEqual({
            width: 350,
            height: 700,
            offsetTop: 5,
            offsetLeft: 2,
        });
        vi.unstubAllGlobals();
    });
});
