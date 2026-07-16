import { test, expect } from '@playwright/test';
import { waitForGameReady } from './helpers/gameCoords.mjs';

test.describe('écran de chargement', () => {
    test('masque le chargement et affiche le canvas', async ({ page }) => {
        await waitForGameReady(page);
        await expect(page.locator('#loading')).toBeHidden();
        await expect(page.locator('#game-container canvas')).toBeVisible();
    });

    test('affiche une erreur si le bundle principal ne charge pas', async ({ page }) => {
        await page.route('**/assets/main-*.js', (route) => route.abort());
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        await expect(page.locator('#loading')).toContainText('Impossible de charger', {
            timeout: 10_000,
        });
        await expect(page.locator('#loading')).toContainText('npm run dev');
        await expect(page.locator('#loading')).not.toContainText('npm start');
    });
});
