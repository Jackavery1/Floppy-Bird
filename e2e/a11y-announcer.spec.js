import { test, expect } from '@playwright/test';
import { startPlayingFromMenu, waitForGameReady, projectUsesTouch } from './helpers/gameCoords.mjs';
import { forceGameOver, waitForTestSeamReady } from './helpers/testSeam.mjs';

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

    test('annonce la mort puis le game over', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        const announcer = page.locator('#ui-announcer');
        await startPlayingFromMenu(page, false);
        await forceGameOver(page, { isDaily: false });
        await expect(announcer).toContainText(/Mort|Game over/i, { timeout: 8_000 });
    });
});
