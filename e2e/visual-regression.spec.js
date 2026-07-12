import { test, expect } from '@playwright/test';
import { enterPausedFromPlaying, waitForGameReady } from './helpers/gameCoords.mjs';
import { forceGameOver, getTestState } from './helpers/testSeam.mjs';

async function waitForTitleFont(page) {
    await page.evaluate(async () => {
        const fonts = document.fonts;
        if (!fonts?.load) return;
        await fonts.load('12px "Press Start 2P"');
        await fonts.ready;
    });
}

async function screenshotCanvas(page, name) {
    const canvas = page.locator('#game-container canvas');
    await expect(canvas).toHaveScreenshot(name, {
        maxDiffPixelRatio: 0.025,
    });
}

test.describe('régression visuelle UI', () => {
    test.beforeEach(async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await waitForGameReady(page);
        await waitForTitleFont(page);
    });

    test('menu — canvas stable', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await expect.poll(async () => getTestState(page)).toBe('menu');
        await screenshotCanvas(page, 'menu-canvas.png');
    });

    test('pause — canvas stable', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await enterPausedFromPlaying(page, false);
        await expect.poll(async () => getTestState(page)).toBe('paused');
        await screenshotCanvas(page, 'pause-canvas.png');
    });

    test('game over — canvas stable', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await forceGameOver(page, { isDaily: false });
        await expect.poll(async () => getTestState(page)).toBe('gameover');
        await page.waitForTimeout(200);
        await screenshotCanvas(page, 'gameover-canvas.png');
    });
});
