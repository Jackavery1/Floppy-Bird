import { expect } from '@playwright/test';
import { GAME_CONFIG } from '../../src/config.js';

export async function getCanvasBox(page) {
    const canvas = page.locator('#game-container canvas');
    await canvas.waitFor({ state: 'visible', timeout: 15_000 });
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas introuvable');
    return { canvas, box };
}

export async function tapGameCoord(page, gameX, gameY) {
    const { box } = await getCanvasBox(page);
    const scaleX = box.width / GAME_CONFIG.width;
    const scaleY = box.height / GAME_CONFIG.height;
    const x = box.x + gameX * scaleX;
    const y = box.y + gameY * scaleY;
    await page.touchscreen.tap(x, y);
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

export async function startPlaying(page) {
    await page.evaluate(() => window.__FLOPPY_TEST__?.startPlaying());
    await expectGameState(page, 'playing');
}

export async function enterPausedFromMenu(page) {
    await page.evaluate(() => window.__FLOPPY_TEST__?.enterPausedFromMenu());
    await expectGameState(page, 'paused');
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
