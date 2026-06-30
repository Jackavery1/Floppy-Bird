import { test } from '@playwright/test';
import { expectGameState, waitForGameReady } from './helpers/gameCoords.mjs';

test.describe('clavier desktop', () => {
    test('ESPACE démarre puis ESC ouvre la pause', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);
        await page.keyboard.press('Space');
        await expectGameState(page, 'playing');

        await page.keyboard.press('Escape');
        await expectGameState(page, 'paused', 10_000);

        await page.waitForTimeout(300);
        await page.keyboard.press('Escape');
        await expectGameState(page, 'playing', 10_000);
    });

    test('M retourne au menu depuis la pause', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);
        await page.keyboard.press('Space');
        await page.keyboard.press('Escape');
        await expectGameState(page, 'paused');

        await page.keyboard.press('KeyM');
        await expectGameState(page, 'menu');
    });
});
