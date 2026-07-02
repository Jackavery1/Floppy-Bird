import { test, expect } from '@playwright/test';
import { GAME_CONFIG } from '../src/config.js';
import {
    expectGameState,
    isMobileLandscapeProject,
    landscapeHintCoversCanvas,
    waitForGameReady,
} from './helpers/gameCoords.mjs';

test.describe('jeu chargé', () => {
    test('affiche le canvas et masque le chargement', async ({ page }) => {
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        await expect(page.locator('#loading')).toHaveClass(/hidden/, { timeout: 20_000 });
        await expect(page.locator('#game-container canvas')).toBeVisible();
    });

    test('respecte le ratio interne 288×512', async ({ page }) => {
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        const canvas = page.locator('#game-container canvas');
        await expect(canvas).toBeVisible({ timeout: 20_000 });
        const box = await canvas.boundingBox();
        expect(box).not.toBeNull();
        expect(box.width / box.height).toBeCloseTo(GAME_CONFIG.width / GAME_CONFIG.height, 1);
    });

    test('conserve le ratio après redimensionnement', async ({ page }) => {
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        const canvas = page.locator('#game-container canvas');
        await expect(canvas).toBeVisible({ timeout: 20_000 });
        const ratio = GAME_CONFIG.width / GAME_CONFIG.height;

        await page.setViewportSize({ width: 390, height: 844 });
        let box = await canvas.boundingBox();
        expect(box).not.toBeNull();
        expect(box.width / box.height).toBeCloseTo(ratio, 1);

        await page.setViewportSize({ width: 844, height: 390 });
        box = await canvas.boundingBox();
        expect(box).not.toBeNull();
        expect(box.width / box.height).toBeCloseTo(ratio, 1);
    });

    test('conserve le ratio avec safe-area simulée', async ({ page }) => {
        await waitForGameReady(page);
        await page.evaluate(() => {
            document.body.style.setProperty('padding', '44px 0 34px 0', 'important');
            window.dispatchEvent(new Event('resize'));
        });
        const canvas = page.locator('#game-container canvas');
        await expect.poll(async () => {
            const box = await canvas.boundingBox();
            return box?.height ?? 0;
        }).toBeGreaterThan(300);
        const box = await canvas.boundingBox();
        expect(box).not.toBeNull();
        expect(box.width / box.height).toBeCloseTo(GAME_CONFIG.width / GAME_CONFIG.height, 1);
        const layout = await page.evaluate(() => window.__FLOPPY_TEST__?.getCanvasLayout?.());
        expect(layout?.height ?? 0).toBeGreaterThan(300);
    });

    test('utilise visualViewport pour le letterbox (clavier virtuel simulé)', async ({ page }) => {
        await page.addInitScript(() => {
            Object.defineProperty(window, 'visualViewport', {
                configurable: true,
                value: {
                    width: 390,
                    height: 620,
                    offsetTop: 24,
                    offsetLeft: 0,
                    addEventListener: (type, fn) => window.addEventListener(type, fn),
                    removeEventListener: (type, fn) => window.removeEventListener(type, fn),
                },
            });
        });
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        const canvas = page.locator('#game-container canvas');
        await expect(canvas).toBeVisible({ timeout: 20_000 });
        const box = await canvas.boundingBox();
        expect(box).not.toBeNull();
        expect(box.width / box.height).toBeCloseTo(GAME_CONFIG.width / GAME_CONFIG.height, 1);
        expect(box.height).toBeLessThanOrEqual(620 + 2);
        const marginTop = await page.evaluate(() => {
            const el = document.getElementById('game-container');
            return parseFloat(getComputedStyle(el).marginTop) || 0;
        });
        expect(marginTop).toBeGreaterThanOrEqual(24);
    });

    test('affiche l’aide paysage en viewport mobile landscape', async ({ page }, testInfo) => {
        test.skip(!isMobileLandscapeProject(testInfo.project.name), 'mobile landscape uniquement');
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        await expect(page.locator('#landscape-hint')).toBeVisible({ timeout: 5_000 });
    });

    test('bloque les taps jeu sous le hint paysage', async ({ page }, testInfo) => {
        test.skip(!isMobileLandscapeProject(testInfo.project.name), 'mobile landscape uniquement');
        await waitForGameReady(page);
        await expect(page.locator('#landscape-hint')).toBeVisible();
        expect(await landscapeHintCoversCanvas(page)).toBe(true);
        await expectGameState(page, 'menu');
    });

    test('expose le manifest PWA', async ({ page }) => {
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        const href = await page.locator('link[rel="manifest"]').first().getAttribute('href');
        expect(href).toMatch(/manifest\.webmanifest$/);
    });
});
