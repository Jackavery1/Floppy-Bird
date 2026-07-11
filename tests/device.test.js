import { describe, it, expect, vi, afterEach } from 'vitest';

function stubMatchMedia(coarse) {
    return vi.fn((query) => ({
        matches: coarse
            ? query.includes('(hover: none) and (pointer: coarse)') ||
              query.includes('(any-pointer: coarse)')
            : query.includes('(pointer: fine)'),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
    }));
}

async function loadDevice(coarse) {
    vi.stubGlobal('matchMedia', stubMatchMedia(coarse));
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

    it('jumpHint tactile', async () => {
        const { jumpHint } = await loadDevice(true);
        expect(jumpHint()).toBe('TAP : sauter');
    });

    it('jumpHint clavier', async () => {
        const { jumpHint } = await loadDevice(false);
        expect(jumpHint()).toBe('ESPACE : sauter');
    });

    it('restartHint tactile', async () => {
        const { restartHint } = await loadDevice(true);
        expect(restartHint()).toBe('TAP : rejouer');
    });

    it('restartHint clavier', async () => {
        const { restartHint } = await loadDevice(false);
        expect(restartHint()).toBe('ESPACE : rejouer');
    });

    it('pauseResumeHint tactile', async () => {
        const { pauseResumeHint } = await loadDevice(true);
        expect(pauseResumeHint()).toBe('TAP : reprendre');
    });

    it('pauseResumeHint clavier', async () => {
        const { pauseResumeHint } = await loadDevice(false);
        expect(pauseResumeHint()).toBe('ESC : reprendre');
    });

    it('menuHint adapte le libellé', async () => {
        const { menuHint } = await loadDevice(true);
        expect(menuHint()).toBe('Bouton MENU ci-dessous');
        const { menuHint: fine } = await loadDevice(false);
        expect(fine()).toBe('M : menu');
    });

    it('difficultyA11yLabel mentionne les touches clavier', async () => {
        const { difficultyA11yLabel } = await loadDevice(false);
        expect(difficultyA11yLabel('normal')).toBe('Difficulté normale — touche 2');
        const { difficultyA11yLabel: touch } = await loadDevice(true);
        expect(touch('hard')).toBe('Difficulté difficile');
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

    it('hardcoreToggleLabel indique ON/OFF sans détail invincibilité', async () => {
        const { hardcoreToggleLabel } = await loadDevice(false);
        expect(hardcoreToggleLabel(true)).toBe('🟥 HARDCORE : ON');
        expect(hardcoreToggleLabel(false)).toBe('⬜ HARDCORE : OFF');
    });

    it('trainingTutorialText mentionne le ralenti', async () => {
        const { trainingTutorialText } = await loadDevice(false);
        expect(trainingTutorialText()).toContain('×0.8');
    });

    it('optionsControlRows liste les commandes du jeu', async () => {
        const { optionsControlRows } = await loadDevice(false);
        const rows = optionsControlRows();
        expect(rows.some((r) => r.key === 'ESPACE' && r.action === 'sauter')).toBe(true);
        expect(rows.some((r) => r.key === 'D' && r.action === 'défi du jour')).toBe(true);
        expect(rows.some((r) => r.key === 'T' && r.action === 'entraînement')).toBe(true);
        expect(rows.some((r) => r.key === 'S·K' && r.action === 'scores · skins')).toBe(true);
    });

    it('optionsControlRows adapte le tactile', async () => {
        const { optionsControlRows } = await loadDevice(true);
        const rows = optionsControlRows();
        expect(rows.some((r) => r.key === 'TAP' && r.action === 'sauter')).toBe(true);
        expect(rows.some((r) => r.key === 'ENTR.' && r.action === 'entraînement')).toBe(true);
        expect(rows.some((r) => r.key === '···' && r.action === 'scores · skins · options')).toBe(
            true
        );
    });

    it('dailyReplayHint et restartHintForMode distinguent le mode daily', async () => {
        const { dailyReplayHint, restartHintForMode } = await loadDevice(true);
        expect(dailyReplayHint()).toBe('TAP : rejouer le défi');
        expect(restartHintForMode(true)).toBe('TAP : rejouer le défi');
        expect(restartHintForMode(false)).toBe('TAP : rejouer');
    });

    it('gameOverRestartLabel affiche REJOUER (classique et défi)', async () => {
        const { gameOverRestartLabel } = await loadDevice(true);
        expect(gameOverRestartLabel(false)).toBe('REJOUER');
        expect(gameOverRestartLabel(true)).toBe('REJOUER');
    });

    it('skipTutorialHint adapte le libellé', async () => {
        const { skipTutorialHint } = await loadDevice(true);
        expect(skipTutorialHint()).toBe('TAP : passer');
        const { skipTutorialHint: fine } = await loadDevice(false);
        expect(fine()).toBe('P : passer');
    });

    it('deathCauseLabel décrit la cause de mort', async () => {
        const { deathCauseLabel } = await loadDevice(false);
        expect(deathCauseLabel('pipe')).toBe('Collision tuyau');
        expect(deathCauseLabel('ground')).toBe('Touché le sol');
        expect(deathCauseLabel(null)).toBe('');
    });

    it('coyoteDeathHint résume la marge coyote au game over', async () => {
        const { coyoteDeathHint } = await loadDevice(false);
        expect(coyoteDeathHint(null)).toBe('');
        expect(coyoteDeathHint(0)).toBe('Grâce coyote épuisée');
        expect(coyoteDeathHint(2)).toBe('Grâce coyote : 2 frames restantes');
        expect(coyoteDeathHint(null, 'ground')).toBe('Grâce coyote : non applicable (sol/plafond)');
    });
});
