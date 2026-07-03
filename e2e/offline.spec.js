import { test, expect } from '@playwright/test';
import { expectGameState, waitForGameReady } from './helpers/gameCoords.mjs';
import { waitForTestSeamReady } from './helpers/testSeam.mjs';

test.describe('PWA hors ligne', () => {
    test('active un service worker après chargement', async ({ page }) => {
        await waitForGameReady(page);
        await page.waitForFunction(() => document.readyState === 'complete', { timeout: 15_000 });
        await expect
            .poll(async () => page.evaluate(() => !!navigator.serviceWorker?.controller))
            .toBe(true);
    });

    test('charge le jeu hors ligne après precache', async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await waitForGameReady(page);
        await expect
            .poll(async () => page.evaluate(() => !!navigator.serviceWorker?.controller))
            .toBe(true);

        await context.setOffline(true);
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.locator('#loading').waitFor({ state: 'hidden', timeout: 20_000 });
        await waitForTestSeamReady(page, 20_000);
        await expect(page.locator('#game-container canvas')).toBeVisible();
        await expectGameState(page, 'menu');

        await context.setOffline(false);
        await context.close();
    });

    test('offline.html affiche le fallback', async ({ page }) => {
        await page.goto('offline.html');
        await expect(page.getByRole('heading', { name: 'Hors ligne' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Retour au jeu' })).toBeVisible();
    });

    test('redirige vers offline.html sans SW ni réseau', async ({ page }) => {
        await page.addInitScript(() => {
            Object.defineProperty(navigator, 'onLine', { get: () => false, configurable: true });
        });
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        await expect(page).toHaveURL(/offline\.html$/);
    });

    test('service worker déclare le precache phaser', async ({ page }) => {
        const response = await page.goto('sw.js');
        expect(response?.ok()).toBe(true);
        const body = await response?.text();
        expect(body).toContain('phaser.min.js');
        expect(body).toContain('index.html');
    });
});
