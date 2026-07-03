import { test, expect } from '@playwright/test';

test.describe('écran de chargement', () => {
    test('affiche une erreur si le bundle principal ne charge pas', async ({ page }) => {
        await page.route('**/assets/index-*.js', (route) => route.abort());
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        await expect(page.locator('#loading')).toContainText('Impossible de charger', {
            timeout: 10_000,
        });
        await expect(page.locator('#loading')).toContainText('npm run dev');
    });
});
