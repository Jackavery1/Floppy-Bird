import { test, expect } from '@playwright/test';
import { expectGameState, startPlayingFromMenu, waitForGameReady } from './helpers/gameCoords.mjs';

test.describe('viewport PWA et métadonnées', () => {
    test('expose og:image et twitter:card pour le partage social', async ({ page }) => {
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
            'content',
            /icon-512\.png/
        );
        await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
            'content',
            'summary_large_image'
        );
        await expect(page.locator('#game-container')).not.toHaveAttribute('role', 'img');
        await expect(page.locator('#game-container canvas')).toHaveAttribute('role', 'application');
        await expect(page.locator('#game-container canvas')).toHaveAttribute(
            'aria-labelledby',
            'game-description'
        );
        await expect(page.locator('#game-description')).toHaveClass(/visually-hidden/);
        await expect(page.locator('main#app')).toHaveAttribute('aria-label', 'Floppy Bird');
    });

    test('expose viewport-fit=cover pour les encoches', async ({ page }) => {
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        await expect(page.locator('meta[name="viewport"]')).toHaveAttribute(
            'content',
            /viewport-fit=cover/
        );
    });

    test('expose le manifest PWA', async ({ page }) => {
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        const href = await page.locator('link[rel="manifest"]').first().getAttribute('href');
        expect(href).toMatch(/manifest\.webmanifest$/);
    });

    test('manifest PWA contient icônes et métadonnées', async ({ page }) => {
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        const href = await page.locator('link[rel="manifest"]').first().getAttribute('href');
        expect(href).toMatch(/manifest\.webmanifest$/);
        const manifest = await page.evaluate(async (url) => {
            const res = await fetch(url);
            return res.json();
        }, href);
        expect(manifest.name).toBe('Floppy Bird');
        expect(manifest.display).toBe('standalone');
        expect(manifest.orientation).toBe('any');
        expect(manifest.icons?.length).toBeGreaterThanOrEqual(4);
        expect(manifest.lang).toBe('fr');
    });

    test('autorise le jeu en tablette paysage sans hint bloquant', async ({ page }, testInfo) => {
        test.skip(
            testInfo.project.name !== 'chromium-tablet-landscape',
            'tablette paysage uniquement'
        );
        await waitForGameReady(page);
        await expect(page.locator('#landscape-hint')).toBeHidden();
        await startPlayingFromMenu(page, true);
        await expectGameState(page, 'playing');
    });
});

test.describe('viewport état partie', () => {
    test('active partie-active et restreint zoom en mobile portrait', async ({
        page,
    }, testInfo) => {
        test.skip(
            testInfo.project.name !== 'chromium-mobile-portrait',
            'mobile portrait uniquement'
        );
        await waitForGameReady(page);
        await startPlayingFromMenu(page, true);
        await expectGameState(page, 'playing');
        await expect(page.locator('html')).toHaveClass(/partie-active/);
        await expect(page.locator('meta[name="viewport"]')).toHaveAttribute(
            'content',
            /user-scalable=no/
        );
    });

    test('active partie-active sur html pendant une partie', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);
        await expect(page.locator('html')).not.toHaveClass(/partie-active/);
        await startPlayingFromMenu(page, false);
        await expectGameState(page, 'playing');
        await expect(page.locator('html')).toHaveClass(/partie-active/);
        await expect(page.locator('html')).toHaveAttribute('data-game-state', 'playing');
    });

    test('autorise le zoom navigateur en partie desktop', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);
        await startPlayingFromMenu(page, false);
        await expectGameState(page, 'playing');
        await expect(page.locator('meta[name="viewport"]')).toHaveAttribute(
            'content',
            /user-scalable=yes/
        );
        await expect(page.locator('meta[name="viewport"]')).toHaveAttribute(
            'content',
            /maximum-scale=3\.0/
        );
    });
});
