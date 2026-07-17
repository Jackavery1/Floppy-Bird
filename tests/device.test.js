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
        expect(pauseResumeHint()).toBe('ESPACE / ESC : reprendre');
    });

    it('menuHint adapte le libellé', async () => {
        const { menuHint } = await loadDevice(true);
        expect(menuHint()).toBe('Bouton MENU ci-dessous');
        const { menuHint: fine } = await loadDevice(false);
        expect(fine()).toBe('M : menu');
    });

    it('firstRunMenuHintText adapte le libellé', async () => {
        const { firstRunMenuHintText } = await loadDevice(true);
        expect(firstRunMenuHintText()).toMatch(/TAP/);
        expect(firstRunMenuHintText()).toMatch(/SKINS/);
        const { firstRunMenuHintText: fine } = await loadDevice(false);
        expect(fine()).toMatch(/ESPACE/);
        expect(fine()).toMatch(/S \/ O \/ K/);
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

    it('hardcoreToggleLabel indique ACTIVÉ/DÉSACTIVÉ sans détail invincibilité', async () => {
        const { hardcoreToggleLabel } = await loadDevice(false);
        expect(hardcoreToggleLabel(true)).toBe('HARDCORE : ACTIVÉ');
        expect(hardcoreToggleLabel(false)).toBe('HARDCORE : DÉSACTIVÉ');
    });

    it('hardcoreToggleLabel mobile utilise HC (≠ Difficile)', async () => {
        const { hardcoreToggleLabel } = await loadDevice(true);
        expect(hardcoreToggleLabel(true)).toBe('HC ACTIF');
        expect(hardcoreToggleLabel(false, false)).toMatch(/^HC · score ≥/);
    });

    it('trainingTutorialText mentionne le ralenti', async () => {
        const { trainingTutorialText } = await loadDevice(false);
        expect(trainingTutorialText()).toContain('×0.8');
    });

    it('gapTutorialText rappelle que le sol reste mortel', async () => {
        const fine = await loadDevice(false);
        expect(fine.gapTutorialText()).toMatch(/sol reste mortel/i);
        const coarse = await loadDevice(true);
        expect(coarse.gapTutorialText()).toMatch(/sol reste mortel/i);
    });

    it('optionsAccessibilityLabel mentionne la touche O', async () => {
        const coarse = await loadDevice(true);
        expect(coarse.optionsAccessibilityLabel()).toBe('Options');
        const fine = await loadDevice(false);
        expect(fine.optionsAccessibilityLabel()).toBe('Options — touche O');
    });

    it('trainingSpeedLabel n’affiche pas de hint tap au clavier', async () => {
        const { trainingSpeedLabel } = await loadDevice(false);
        expect(trainingSpeedLabel(0.8)).toBe('VITESSE ENTRAÎNEMENT : 80 %');
        expect(trainingSpeedLabel(0.8)).not.toMatch(/tap/i);
    });

    it('optionsControlRows liste les commandes du jeu', async () => {
        const { optionsControlRows } = await loadDevice(false);
        const rows = optionsControlRows();
        expect(rows.some((r) => r.key === 'ESPACE' && r.action === 'sauter · reprendre')).toBe(
            true
        );
        expect(rows.some((r) => r.key === 'P' && r.action === 'passer le tutoriel')).toBe(true);
        expect(rows.some((r) => r.key === 'ESC' && r.action === 'pause · reprendre')).toBe(true);
        expect(rows.some((r) => r.key === '←·→' && r.action === 'apparence')).toBe(true);
        expect(rows.some((r) => r.key === 'ESC·ESP')).toBe(false);
        expect(rows.some((r) => r.key === 'D' && r.action === 'défi du jour')).toBe(true);
        expect(rows.some((r) => r.key === 'T' && r.action === 'entraînement')).toBe(true);
        expect(rows.some((r) => r.key === 'S·O·K' && r.action === 'scores · options · skins')).toBe(
            true
        );
    });

    it('optionsControlRows adapte le tactile', async () => {
        const { optionsControlRows } = await loadDevice(true);
        const rows = optionsControlRows();
        expect(rows.some((r) => r.key === 'TAP' && r.action === 'sauter · reprendre')).toBe(true);
        expect(rows.some((r) => r.key === 'DIFF.' && r.action === 'difficulté')).toBe(true);
        expect(rows.some((r) => r.key === 'PAUSE' && r.action === 'mettre en pause')).toBe(true);
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
});
