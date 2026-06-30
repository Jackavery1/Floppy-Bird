import { test, expect } from '@playwright/test';
import { waitForGameReady, waitForServiceWorker } from './helpers/gameCoords.mjs';

test.describe('PWA hors ligne', () => {
    test('charge après une visite en ligne (cache SW)', async ({ page, context }) => {
        await waitForGameReady(page);
        await waitForServiceWorker(page);

        await context.setOffline(true);
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.locator('#loading').waitFor({ state: 'hidden', timeout: 25_000 });
        await expect(page.locator('#game-container canvas')).toBeVisible();
    });

    test('offline.html affiche le fallback', async ({ page }) => {
        await page.goto('/offline.html');
        await expect(page.getByRole('heading', { name: 'Hors ligne' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Retour au jeu' })).toBeVisible();
    });
});
