import { describe, it, expect, vi, afterEach } from 'vitest';

async function loadDevice(coarse) {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: coarse })));
    vi.resetModules();
    return import('../src/device.js');
}

describe('device', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('isCoarsePointer reflète matchMedia', async () => {
        const coarse = await loadDevice(true);
        expect(coarse.isCoarsePointer()).toBe(true);
        const fine = await loadDevice(false);
        expect(fine.isCoarsePointer()).toBe(false);
    });

    it('jumpHint adapte le libellé au type de pointeur', async () => {
        const { jumpHint } = await loadDevice(true);
        expect(jumpHint()).toBe('TAP : sauter');
        const { jumpHint: fine } = await loadDevice(false);
        expect(fine()).toBe('ESPACE : sauter');
    });

    it('restartHint adapte le libellé', async () => {
        const { restartHint } = await loadDevice(true);
        expect(restartHint()).toBe('TAP : rejouer');
        const { restartHint: fine } = await loadDevice(false);
        expect(fine()).toBe('ESPACE : rejouer');
    });

    it('pauseResumeHint adapte le libellé', async () => {
        const { pauseResumeHint } = await loadDevice(true);
        expect(pauseResumeHint()).toBe('TAP : reprendre');
        const { pauseResumeHint: fine } = await loadDevice(false);
        expect(fine()).toBe('ESC : reprendre');
    });

    it('difficultyHint adapte le libellé', async () => {
        const { difficultyHint } = await loadDevice(true);
        expect(difficultyHint()).toBe('Boutons : difficulté');
        const { difficultyHint: fine } = await loadDevice(false);
        expect(fine()).toBe('1  2  3 : difficulté');
    });

    it('menuHint adapte le libellé', async () => {
        const { menuHint } = await loadDevice(true);
        expect(menuHint()).toBe('Bouton MENU ci-dessous');
        const { menuHint: fine } = await loadDevice(false);
        expect(fine()).toBe('M : menu');
    });
});
