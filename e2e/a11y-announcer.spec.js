import { test, expect } from '@playwright/test';
import { startPlayingFromMenu, waitForGameReady, projectUsesTouch } from './helpers/gameCoords.mjs';
import { advancePipeForScore, forceGameOver, waitForTestSeamReady } from './helpers/testSeam.mjs';

test.describe('annonces screen reader', () => {
    test.beforeEach(async ({ page }) => {
        await waitForGameReady(page);
        await waitForTestSeamReady(page);
    });

    test('annonce le démarrage de partie', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        const announcer = page.locator('#ui-announcer');
        await startPlayingFromMenu(page, projectUsesTouch(testInfo));
        await expect(announcer).toContainText(/Partie démarrée/i, { timeout: 5_000 });
    });

    test('annonce le score au premier point', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        const announcer = page.locator('#ui-announcer');
        await startPlayingFromMenu(page, false);
        await advancePipeForScore(page);
        await expect(announcer).toContainText(/Score 1/i, { timeout: 5_000 });
    });

    test('annonce les multiples de 5 en partie', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        const announcer = page.locator('#ui-announcer');
        await startPlayingFromMenu(page, false);
        for (let i = 0; i < 5; i++) {
            await advancePipeForScore(page);
        }
        await expect(announcer).toContainText(/Score 5/i, { timeout: 5_000 });
    });

    test('annonce la mort puis le game over', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        const announcer = page.locator('#ui-announcer');
        await startPlayingFromMenu(page, false);
        await forceGameOver(page, { isDaily: false });
        await expect(announcer).toContainText(/Mort|Game over/i, { timeout: 8_000 });
    });

    test('annonce ouverture/fermeture du panneau options et changement d’onglet', async ({
        page,
    }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        const announcer = page.locator('#ui-announcer');
        await page.locator('#a11y-options').click({ force: true });
        await expect(announcer).toContainText(/Panneau options ouvert/i, { timeout: 5_000 });
        await page.locator('#a11y-options-tab-controls').click({ force: true });
        await expect(announcer).toContainText(/Onglet contrôles/i, { timeout: 5_000 });
        await page.locator('#a11y-options-tab-preferences').click({ force: true });
        await expect(announcer).toContainText(/Onglet réglages/i, { timeout: 5_000 });
        await page.locator('#a11y-options-close').click({ force: true });
        await expect(announcer).toContainText(/Panneau options fermé/i, { timeout: 5_000 });
    });
});
