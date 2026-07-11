import { describe, it, expect, vi } from 'vitest';
import {
    computeLetterboxSize,
    computeLetterboxPosition,
    readSafeAreaInsets,
    getLetterboxViewport,
} from '../src/viewport.js';

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

    it('computeLetterboxPosition centre dans le visualViewport', () => {
        const pos = computeLetterboxPosition(390, 620, 300, 533, 22, 0);
        expect(pos.top).toBe(22 + Math.max(0, (620 - 533) / 2));
        expect(pos.left).toBe(Math.max(0, (390 - 300) / 2));
    });

    it('computeLetterboxPosition décale au pinch-zoom (offsets visualViewport)', () => {
        const pos = computeLetterboxPosition(260, 460, 200, 355, 40, 30);
        expect(pos.left).toBe(30 + Math.max(0, (260 - 200) / 2));
        expect(pos.top).toBe(40 + Math.max(0, (460 - 355) / 2));
    });

    it('readSafeAreaInsets retourne des zéros sans document', () => {
        expect(readSafeAreaInsets()).toEqual({ top: 0, right: 0, bottom: 0, left: 0 });
    });

    it('getLetterboxViewport expose visualViewport quand le body n’est pas prêt', () => {
        vi.stubGlobal('window', {
            visualViewport: { width: 390, height: 400, offsetTop: 12, offsetLeft: 4, scale: 1 },
        });
        vi.stubGlobal('document', {
            body: { clientWidth: 0, clientHeight: 0 },
        });
        vi.stubGlobal('getComputedStyle', () => ({
            paddingTop: '0px',
            paddingRight: '0px',
            paddingBottom: '0px',
            paddingLeft: '0px',
        }));
        expect(getLetterboxViewport()).toEqual({
            width: 390,
            height: 400,
            offsetTop: 12,
            offsetLeft: 4,
            scale: 1,
        });
        vi.unstubAllGlobals();
    });

    it('getLetterboxViewport propage le scale au zoom navigateur', () => {
        vi.stubGlobal('window', {
            visualViewport: { width: 640, height: 360, offsetTop: 0, offsetLeft: 0, scale: 2 },
        });
        vi.stubGlobal('document', {
            body: { clientWidth: 0, clientHeight: 0 },
        });
        vi.stubGlobal('getComputedStyle', () => ({
            paddingTop: '0px',
            paddingRight: '0px',
            paddingBottom: '0px',
            paddingLeft: '0px',
        }));
        expect(getLetterboxViewport().scale).toBe(2);
        vi.unstubAllGlobals();
    });

    it('getLetterboxViewport utilise le client du body', () => {
        vi.stubGlobal('window', {
            innerWidth: 350,
            innerHeight: 700,
            visualViewport: { width: 350, height: 700, offsetTop: 5, offsetLeft: 2 },
        });
        vi.stubGlobal('document', {
            body: { clientWidth: 350, clientHeight: 700 },
        });
        expect(getLetterboxViewport()).toEqual({
            width: 350,
            height: 700,
            offsetTop: 5,
            offsetLeft: 2,
            scale: 1,
        });
        vi.unstubAllGlobals();
    });

    it('getLetterboxViewport réduit la hauteur quand visualViewport est plus petit (clavier)', () => {
        vi.stubGlobal('window', {
            innerWidth: 390,
            innerHeight: 844,
            visualViewport: { width: 390, height: 620, offsetTop: 18, offsetLeft: 0 },
        });
        vi.stubGlobal('document', {
            body: { clientWidth: 390, clientHeight: 844 },
        });
        expect(getLetterboxViewport()).toEqual({
            width: 390,
            height: 620,
            offsetTop: 18,
            offsetLeft: 0,
            scale: 1,
        });
        vi.unstubAllGlobals();
    });

    it('getLetterboxViewport retombe sur visualViewport avec safe-area', () => {
        vi.stubGlobal('window', {
            visualViewport: { width: 400, height: 800, offsetTop: 10, offsetLeft: 0 },
        });
        vi.stubGlobal('document', {
            body: { clientWidth: 0, clientHeight: 0 },
        });
        vi.stubGlobal('getComputedStyle', () => ({
            paddingTop: '20px',
            paddingRight: '10px',
            paddingBottom: '20px',
            paddingLeft: '10px',
        }));
        expect(getLetterboxViewport()).toEqual({
            width: 380,
            height: 760,
            offsetTop: 30,
            offsetLeft: 10,
            scale: 1,
        });
        vi.unstubAllGlobals();
    });
});
