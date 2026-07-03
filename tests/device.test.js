import { describe, it, expect, vi, afterEach } from 'vitest';

async function loadDevice(coarse) {
    vi.stubGlobal(
        'matchMedia',
        vi.fn((query) => ({
            matches:
                coarse &&
                (query.includes('pointer: coarse') || query.includes('any-pointer: coarse')),
        }))
    );
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

    it('hardcoreToggleLabel mentionne la grace progressive', async () => {
        const { hardcoreToggleLabel } = await loadDevice(false);
        expect(hardcoreToggleLabel(true)).toContain('700→325 ms');
    });

    it('hardcoreInvincibilityHintText indique la durée', async () => {
        const { hardcoreInvincibilityHintText } = await loadDevice(false);
        expect(hardcoreInvincibilityHintText(625)).toContain('625 ms');
    });

    it('modesHintLine renvoie vers OPTIONS', async () => {
        const { modesHintLine } = await loadDevice(false);
        expect(modesHintLine().toLowerCase()).toContain('options');
    });

    it('dailyReplayHint et restartHintForMode distinguent le mode daily', async () => {
        const { dailyReplayHint, restartHintForMode } = await loadDevice(true);
        expect(dailyReplayHint()).toBe('TAP : rejouer le défi');
        expect(restartHintForMode(true)).toBe('TAP : rejouer le défi');
        expect(restartHintForMode(false)).toBe('TAP : rejouer');
    });

    it('deathCauseLabel décrit la cause de mort', async () => {
        const { deathCauseLabel } = await loadDevice(false);
        expect(deathCauseLabel('pipe')).toBe('Collision tuyau');
        expect(deathCauseLabel('ground')).toBe('Touché le sol');
        expect(deathCauseLabel(null)).toBe('');
    });
});
