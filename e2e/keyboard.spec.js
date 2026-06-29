import { test, expect } from '@playwright/test';
import { waitForGameReady } from './helpers/gameCoords.mjs';

test.describe('clavier desktop', () => {
    test('ESPACE démarre puis ESC ouvre la pause', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);
        await page.keyboard.press('Space');
        await expect(page.getByText('PAUSE')).not.toBeVisible();

        await page.keyboard.press('Escape');
        await expect(page.getByText('PAUSE')).toBeVisible({ timeout: 5_000 });

        await page.keyboard.press('Escape');
        await expect(page.getByText('PAUSE')).not.toBeVisible({ timeout: 5_000 });
    });

    test('M retourne au menu depuis la pause', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);
        await page.keyboard.press('Space');
        await page.keyboard.press('Escape');
        await expect(page.getByText('PAUSE')).toBeVisible({ timeout: 5_000 });

        await page.keyboard.press('KeyM');
        await expect(page.getByText('APPUYER POUR JOUER')).toBeVisible({ timeout: 5_000 });
    });
});
