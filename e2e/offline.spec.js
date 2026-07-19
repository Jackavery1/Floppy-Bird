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
        // Precache (≤45s) + reload hors ligne + boot jeu : au-delà du timeout global 45s.
        test.setTimeout(120_000);
        const context = await browser.newContext();
        const page = await context.newPage();
        await waitForGameReady(page);
        await expect
            .poll(async () => page.evaluate(() => !!navigator.serviceWorker?.controller), {
                timeout: 20_000,
            })
            .toBe(true);
        // expect.poll (pas waitForFunction async) : une async fn renvoie une Promise
        // truthy et court-circuite l’attente du precache Workbox.
        await expect
            .poll(
                async () =>
                    page.evaluate(async () => {
                        await navigator.serviceWorker.ready;
                        const names = await caches.keys();
                        for (const name of names) {
                            const cache = await caches.open(name);
                            const keys = await cache.keys();
                            const urls = keys.map((req) => req.url);
                            if (
                                urls.some((u) => u.includes('index.html')) &&
                                urls.some((u) => u.includes('phaser.min.js'))
                            ) {
                                return true;
                            }
                        }
                        return false;
                    }),
                { timeout: 45_000 }
            )
            .toBe(true);

        await context.setOffline(true);
        // Navigation depuis le document : sous Playwright Windows, goto/reload API
        // hors ligne peut lever ERR_INTERNET_DISCONNECTED avant l’interception SW.
        try {
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30_000 }),
                page.evaluate(() => {
                    window.location.reload();
                }),
            ]);
        } catch (err) {
            const msg = err?.message ?? String(err);
            if (!/ERR_INTERNET_DISCONNECTED|net::ERR_/i.test(msg)) throw err;
        }
        await expect(page.locator('#game-container')).toBeVisible({ timeout: 30_000 });
        await page.locator('#loading').waitFor({ state: 'hidden', timeout: 30_000 });
        await waitForTestSeamReady(page, 30_000);
        await expect(page.locator('#game-container canvas')).toBeVisible();
        await expectGameState(page, 'menu');

        await context.setOffline(false);
        await context.close();
    });

    test('offline.html affiche le fallback', async ({ page }) => {
        await page.goto('offline.html');
        await expect(page.getByRole('heading', { name: 'Hors ligne' })).toBeVisible();
        const retour = page.getByRole('link', { name: 'Retour au jeu' });
        await expect(retour).toBeVisible();
        const box = await retour.boundingBox();
        expect(box).not.toBeNull();
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(44);
        await expect(page.locator('link[rel="stylesheet"][href="shell-tokens.css"]')).toHaveCount(
            1
        );
        await expect(page.locator('link[rel="stylesheet"][href="offline-page.css"]')).toHaveCount(
            1
        );
        await page.evaluate(async () => {
            await document.fonts.load('12px "Press Start 2P"');
            await document.fonts.ready;
        });
        await expect
            .poll(
                () =>
                    page.evaluate(() =>
                        getComputedStyle(document.querySelector('h1')).fontFamily.toLowerCase()
                    ),
                { timeout: 10_000 }
            )
            .toContain('press start 2p');
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
        expect(body).toContain('favicon-32.png');
        expect(body).toContain('icon-192.png');
    });
});
