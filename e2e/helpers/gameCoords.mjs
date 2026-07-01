import { expect } from '@playwright/test';
import { GAME_CONFIG } from '../../src/config.js';
import { TOUCH_TARGETS } from '../../src/uiLayout.js';

export async function getCanvasBox(page) {
    const canvas = page.locator('#game-container canvas');
    await canvas.waitFor({ state: 'visible', timeout: 15_000 });
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas introuvable');
    return { canvas, box };
}

export function gameCoordToScreen(box, gameX, gameY) {
    const scaleX = box.width / GAME_CONFIG.width;
    const scaleY = box.height / GAME_CONFIG.height;
    return {
        x: box.x + gameX * scaleX,
        y: box.y + gameY * scaleY,
    };
}

/** @param {boolean} usesTouch */
export async function pointerGameCoord(page, gameX, gameY, usesTouch) {
    const { box } = await getCanvasBox(page);
    const { x, y } = gameCoordToScreen(box, gameX, gameY);
    if (usesTouch) {
        await page.touchscreen.tap(x, y);
    } else {
        await page.mouse.click(x, y);
    }
}

export async function tapGameCoord(page, gameX, gameY) {
    await pointerGameCoord(page, gameX, gameY, true);
}

export async function waitForGameReady(page) {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('#loading').waitFor({ state: 'hidden', timeout: 20_000 });
    await page.waitForFunction(() => window.__FLOPPY_TEST__?.ready(), { timeout: 20_000 });
    await getCanvasBox(page);
}

export async function expectGameState(page, state, timeout = 8_000) {
    await expect.poll(async () => page.evaluate(() => window.__FLOPPY_TEST__?.getState()), { timeout }).toBe(state);
}

/** @param {boolean} usesTouch */
export async function startPlayingFromMenu(page, usesTouch) {
    const { menuStart } = TOUCH_TARGETS;
    await pointerGameCoord(page, menuStart.x, menuStart.y, usesTouch);
    await expectGameState(page, 'playing');
}

/** @param {boolean} usesTouch */
export async function openPauseFromPlaying(page, usesTouch) {
    const { pauseButton } = TOUCH_TARGETS;
    await pointerGameCoord(page, pauseButton.x, pauseButton.y, usesTouch);
    await expectGameState(page, 'paused');
}

/** @param {boolean} usesTouch */
export async function enterPausedFromPlaying(page, usesTouch) {
    await startPlayingFromMenu(page, usesTouch);
    await openPauseFromPlaying(page, usesTouch);
}

export function projectUsesTouch(testInfo) {
    return testInfo.project.use.hasTouch ?? false;
}

export async function waitForServiceWorker(page) {
    await page.evaluate(async () => {
        if (!('serviceWorker' in navigator)) return;
        const reg = await navigator.serviceWorker.getRegistration();
        if (!reg) await navigator.serviceWorker.register('./sw.js', { scope: './' });
        await navigator.serviceWorker.ready;
    });
    await page.waitForFunction(
        () => navigator.serviceWorker?.controller != null,
        { timeout: 30_000 },
    );
}
