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
    await page.goto('/');
    await page.locator('#loading').waitFor({ state: 'hidden', timeout: 15_000 });
    await getCanvasBox(page);
}

export async function waitForServiceWorker(page) {
    await page.waitForFunction(
        () => navigator.serviceWorker?.controller != null,
        { timeout: 20_000 },
    );
}
