import { test, expect } from '@playwright/test';
import { GAME_CONFIG } from '../src/config.js';
import {
    expectGameState,
    isMobileLandscapeProject,
    landscapeHintCoversCanvas,
    startPlayingFromMenu,
    waitForGameReady,
} from './helpers/gameCoords.mjs';
import { getCanvasLayout } from './helpers/testSeam.mjs';

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
        await expect
            .poll(async () => {
                const box = await canvas.boundingBox();
                return box?.height ?? 0;
            })
            .toBeGreaterThan(300);
        const box = await canvas.boundingBox();
        expect(box).not.toBeNull();
        expect(box.width / box.height).toBeCloseTo(GAME_CONFIG.width / GAME_CONFIG.height, 1);
        const layout = await getCanvasLayout(page);
        expect(layout?.height ?? 0).toBeGreaterThan(300);
    });

    test('utilise visualViewport pour le letterbox (clavier virtuel simulé)', async ({
        page,
    }, testInfo) => {
        test.skip(
            testInfo.project.name.startsWith('webkit'),
            'mock visualViewport fragile sous WebKit'
        );
        await page.setViewportSize({ width: 390, height: 844 });
        await waitForGameReady(page);
        const metrics = await page.evaluate(() => {
            Object.defineProperty(window, 'visualViewport', {
                configurable: true,
                value: {
                    width: 390,
                    height: 620,
                    offsetTop: 24,
                    offsetLeft: 0,
                    addEventListener: () => {},
                    removeEventListener: () => {},
                },
            });
            window.dispatchEvent(new Event('resize'));
            const canvas = document.querySelector('#game-container canvas');
            const container = document.getElementById('game-container');
            const box = canvas?.getBoundingClientRect();
            const vv = { width: 390, height: 620, offsetTop: 24, offsetLeft: 0 };
            const cx = vv.offsetLeft + vv.width / 2;
            const cy = vv.offsetTop + vv.height / 2;
            const canvasCx = box ? box.left + box.width / 2 : 0;
            const canvasCy = box ? box.top + box.height / 2 : 0;
            return {
                top: parseFloat(getComputedStyle(container).top) || 0,
                canvasHeight: box?.height ?? 0,
                ratio: box && box.height > 0 ? box.width / box.height : 0,
                deltaX: Math.abs(canvasCx - cx),
                deltaY: Math.abs(canvasCy - cy),
            };
        });
        expect(metrics.ratio).toBeCloseTo(GAME_CONFIG.width / GAME_CONFIG.height, 1);
        expect(metrics.canvasHeight).toBeLessThanOrEqual(622);
        expect(metrics.top).toBeGreaterThanOrEqual(24);
        expect(metrics.deltaX).toBeLessThan(8);
        expect(metrics.deltaY).toBeLessThan(8);
    });

    test('conserve le centrage après zoom pinch simulé', async ({ page }, testInfo) => {
        test.skip(
            testInfo.project.name.startsWith('webkit'),
            'mock visualViewport fragile sous WebKit'
        );
        await page.setViewportSize({ width: 390, height: 844 });
        await waitForGameReady(page);
        const metrics = await page.evaluate(() => {
            Object.defineProperty(window, 'visualViewport', {
                configurable: true,
                value: {
                    width: 260,
                    height: 460,
                    offsetTop: 40,
                    offsetLeft: 30,
                    scale: 1.5,
                    addEventListener: () => {},
                    removeEventListener: () => {},
                },
            });
            window.dispatchEvent(new Event('resize'));
            const canvas = document.querySelector('#game-container canvas');
            const box = canvas?.getBoundingClientRect();
            const vv = { width: 260, height: 460, offsetTop: 40, offsetLeft: 30 };
            const cx = vv.offsetLeft + vv.width / 2;
            const cy = vv.offsetTop + vv.height / 2;
            const canvasCx = box ? box.left + box.width / 2 : 0;
            const canvasCy = box ? box.top + box.height / 2 : 0;
            return {
                ratio: box && box.height > 0 ? box.width / box.height : 0,
                deltaX: Math.abs(canvasCx - cx),
                deltaY: Math.abs(canvasCy - cy),
            };
        });
        expect(metrics.ratio).toBeCloseTo(GAME_CONFIG.width / GAME_CONFIG.height, 1);
        expect(metrics.deltaX).toBeLessThan(8);
        expect(metrics.deltaY).toBeLessThan(8);
    });

    test('affiche l’aide paysage sur grand téléphone en paysage', async ({ page }) => {
        await page.setViewportSize({ width: 932, height: 430 });
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        await expect(page.locator('#landscape-hint')).toBeVisible({ timeout: 5_000 });
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

    test('conserve le ratio après rotation en cours de partie', async ({ page }, testInfo) => {
        test.skip(
            testInfo.project.name !== 'chromium-mobile-portrait',
            'mobile portrait uniquement'
        );
        await waitForGameReady(page);
        await startPlayingFromMenu(page, true);
        await expectGameState(page, 'playing');

        const ratio = GAME_CONFIG.width / GAME_CONFIG.height;
        await page.setViewportSize({ width: 844, height: 390 });
        await page.waitForTimeout(200);

        const box = await page.locator('#game-container canvas').boundingBox();
        expect(box).not.toBeNull();
        expect(box.width / box.height).toBeCloseTo(ratio, 1);
        await expectGameState(page, 'playing');
    });

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
        await expect(page.locator('#game-container')).toHaveAttribute('role', 'img');
        await expect(page.locator('#game-container')).toHaveAttribute(
            'aria-labelledby',
            'game-description'
        );
        await expect(page.locator('main#app')).toHaveAttribute('aria-label', 'Floppy Bird');
    });

    test('expose le manifest PWA', async ({ page }) => {
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        const href = await page.locator('link[rel="manifest"]').first().getAttribute('href');
        expect(href).toMatch(/manifest\.webmanifest$/);
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
