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

    it('trainingHint adapte le libellé', async () => {
        const { trainingHint } = await loadDevice(true);
        expect(trainingHint()).toBe('Tap : entraînement');
        const { trainingHint: fine } = await loadDevice(false);
        expect(fine()).toBe('T : entraînement');
    });

    it('hardcoreHint adapte le libellé', async () => {
        const { hardcoreHint } = await loadDevice(true);
        expect(hardcoreHint()).toBe('Tap : hardcore');
        const { hardcoreHint: fine } = await loadDevice(false);
        expect(fine()).toBe('H : hardcore');
    });

    it('hardcoreToggleLabel mentionne la grace spawn 450 ms', async () => {
        const { hardcoreToggleLabel } = await loadDevice(false);
        expect(hardcoreToggleLabel(true)).toContain('450 ms');
    });

    it('modesHintLine compacte sur tactile', async () => {
        const { modesHintLine } = await loadDevice(true);
        expect(modesHintLine()).toContain('MODES');
        expect(modesHintLine()).toContain('exclusifs');
    });
});
