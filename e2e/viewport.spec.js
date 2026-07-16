import { test, expect } from '@playwright/test';
import { GAME_CONFIG } from '../src/config.js';
import {
    expectGameState,
    isMobileLandscapeProject,
    landscapeHintCoversCanvas,
    waitForGameReady,
} from './helpers/gameCoords.mjs';
import { forceGameOver, getCanvasLayout } from './helpers/testSeam.mjs';
import {
    dispatchViewportResize,
    mockVisualViewport,
    readLetterboxMetrics,
} from './helpers/visualViewport.mjs';

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

    test('conserve le ratio avec safe-area quatre côtés (encoche simulée)', async ({ page }) => {
        await waitForGameReady(page);
        const ratio = GAME_CONFIG.width / GAME_CONFIG.height;
        await page.evaluate(() => {
            document.body.style.setProperty('padding', '44px 20px 34px 16px', 'important');
            window.dispatchEvent(new Event('resize'));
        });
        await expect
            .poll(async () => {
                const box = await page.locator('#game-container canvas').boundingBox();
                return box?.height ?? 0;
            })
            .toBeGreaterThan(280);
        const metrics = await page.evaluate(() => {
            const canvas = document.querySelector('#game-container canvas');
            const box = canvas?.getBoundingClientRect();
            const cs = getComputedStyle(document.body);
            const padTop = Number.parseFloat(cs.paddingTop) || 0;
            const padLeft = Number.parseFloat(cs.paddingLeft) || 0;
            const padRight = Number.parseFloat(cs.paddingRight) || 0;
            const padBottom = Number.parseFloat(cs.paddingBottom) || 0;
            return {
                ratio: box && box.height > 0 ? box.width / box.height : 0,
                canvasHeight: box?.height ?? 0,
                withinSafeTop: (box?.top ?? 0) >= padTop - 1,
                withinSafeLeft: (box?.left ?? 0) >= padLeft - 1,
                withinSafeRight: (box?.right ?? 0) <= window.innerWidth - padRight + 1,
                withinSafeBottom: (box?.bottom ?? 0) <= window.innerHeight - padBottom + 1,
            };
        });
        expect(metrics.ratio).toBeCloseTo(ratio, 1);
        expect(metrics.canvasHeight).toBeGreaterThan(280);
        expect(metrics.withinSafeTop).toBe(true);
        expect(metrics.withinSafeLeft).toBe(true);
        expect(metrics.withinSafeRight).toBe(true);
        expect(metrics.withinSafeBottom).toBe(true);
    });

    test('conserve le ratio en tablette portrait', async ({ page }, testInfo) => {
        test.skip(
            testInfo.project.name !== 'chromium-tablet-portrait',
            'tablette portrait uniquement'
        );
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        const canvas = page.locator('#game-container canvas');
        await expect(canvas).toBeVisible({ timeout: 20_000 });
        const box = await canvas.boundingBox();
        expect(box).not.toBeNull();
        expect(box.width / box.height).toBeCloseTo(GAME_CONFIG.width / GAME_CONFIG.height, 1);
    });

    test('conserve le ratio en tablette paysage', async ({ page }, testInfo) => {
        test.skip(
            testInfo.project.name !== 'chromium-tablet-landscape',
            'tablette paysage uniquement'
        );
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        const canvas = page.locator('#game-container canvas');
        await expect(canvas).toBeVisible({ timeout: 20_000 });
        const box = await canvas.boundingBox();
        expect(box).not.toBeNull();
        expect(box.width / box.height).toBeCloseTo(GAME_CONFIG.width / GAME_CONFIG.height, 1);
    });

    test('conserve le ratio en WebKit mobile portrait', async ({ page }, testInfo) => {
        test.skip(
            testInfo.project.name !== 'webkit-mobile-portrait',
            'WebKit mobile portrait uniquement'
        );
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        const canvas = page.locator('#game-container canvas');
        await expect(canvas).toBeVisible({ timeout: 20_000 });
        const box = await canvas.boundingBox();
        expect(box).not.toBeNull();
        expect(box.width / box.height).toBeCloseTo(GAME_CONFIG.width / GAME_CONFIG.height, 1);
    });

    test('conserve le ratio en WebKit tablette portrait', async ({ page }, testInfo) => {
        test.skip(
            testInfo.project.name !== 'webkit-tablet-portrait',
            'WebKit tablette portrait uniquement'
        );
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        const canvas = page.locator('#game-container canvas');
        await expect(canvas).toBeVisible({ timeout: 20_000 });
        const box = await canvas.boundingBox();
        expect(box).not.toBeNull();
        expect(box.width / box.height).toBeCloseTo(GAME_CONFIG.width / GAME_CONFIG.height, 1);
    });

    test('utilise visualViewport pour le letterbox (clavier virtuel simulé)', async ({ page }) => {
        const vv = { width: 390, height: 620, offsetTop: 24, offsetLeft: 0 };
        await page.setViewportSize({ width: 390, height: 844 });
        await waitForGameReady(page);
        await mockVisualViewport(page, vv);
        await dispatchViewportResize(page);
        const metrics = await readLetterboxMetrics(page, vv);
        expect(metrics.ratio).toBeCloseTo(GAME_CONFIG.width / GAME_CONFIG.height, 1);
        expect(metrics.canvasHeight).toBeLessThanOrEqual(622);
        expect(metrics.top).toBeGreaterThanOrEqual(24);
        expect(metrics.deltaX).toBeLessThan(8);
        expect(metrics.deltaY).toBeLessThan(8);
    });

    test('conserve le centrage après zoom pinch simulé', async ({ page }) => {
        const vv = { width: 260, height: 460, offsetTop: 40, offsetLeft: 30, scale: 1.5 };
        await page.setViewportSize({ width: 390, height: 844 });
        await waitForGameReady(page);
        await mockVisualViewport(page, vv);
        await dispatchViewportResize(page);
        const metrics = await readLetterboxMetrics(page, vv);
        expect(metrics.ratio).toBeCloseTo(GAME_CONFIG.width / GAME_CONFIG.height, 1);
        expect(metrics.deltaX).toBeLessThan(8);
        expect(metrics.deltaY).toBeLessThan(8);
    });

    test('conserve le centrage au zoom navigateur 200 % simulé', async ({ page }) => {
        const vv = { width: 640, height: 360, offsetTop: 0, offsetLeft: 0, scale: 2 };
        await page.setViewportSize({ width: 1280, height: 720 });
        await waitForGameReady(page);
        await mockVisualViewport(page, vv);
        await dispatchViewportResize(page);
        const metrics = await readLetterboxMetrics(page, vv);
        expect(metrics.scale).toBe(2);
        expect(metrics.ratio).toBeCloseTo(GAME_CONFIG.width / GAME_CONFIG.height, 1);
        expect(metrics.deltaX).toBeLessThan(8);
        expect(metrics.deltaY).toBeLessThan(8);
    });

    test('conserve les boutons game over au zoom navigateur 200 % simulé', async ({ page }) => {
        const vv = { width: 640, height: 360, offsetTop: 0, offsetLeft: 0, scale: 2 };
        await page.setViewportSize({ width: 1280, height: 720 });
        await waitForGameReady(page);
        await forceGameOver(page);
        await expectGameState(page, 'gameover');
        await mockVisualViewport(page, vv);
        await dispatchViewportResize(page);

        const restart = page.locator('#a11y-gameover-restart');
        await expect(restart).toBeVisible();
        const box = await restart.boundingBox();
        expect(box).not.toBeNull();
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);

        const layout = await getCanvasLayout(page);
        expect(layout?.width ?? 0).toBeGreaterThan(100);
        expect(layout?.height ?? 0).toBeGreaterThan(100);
    });

    test('affiche l’aide paysage sur grand téléphone en paysage', async ({ page }, testInfo) => {
        test.skip(
            !isMobileLandscapeProject(testInfo.project.name),
            'coarse pointer requis (mobile landscape)'
        );
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
});
