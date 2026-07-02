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

/** @param {boolean} usesTouch @param {{ force?: boolean }} [opts] */
export async function pointerGameCoord(page, gameX, gameY, usesTouch, opts = {}) {
    const { canvas, box } = await getCanvasBox(page);
    const position = {
        x: gameX * (box.width / GAME_CONFIG.width),
        y: gameY * (box.height / GAME_CONFIG.height),
    };
    if (usesTouch) {
        await canvas.tap({ position, force: opts.force ?? false });
    } else {
        await canvas.click({ position, force: opts.force ?? false });
    }
}

const LANDSCAPE_HINT_HIDE_CSS = '#landscape-hint { display: none !important; pointer-events: none !important; }';

export async function hideLandscapeHint(page) {
    await page.addInitScript((css) => {
        const inject = () => {
            if (document.getElementById('e2e-hide-landscape')) return;
            const style = document.createElement('style');
            style.id = 'e2e-hide-landscape';
            style.textContent = css;
            (document.head || document.documentElement).appendChild(style);
        };
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', inject);
        } else {
            inject();
        }
    }, LANDSCAPE_HINT_HIDE_CSS);
}

export async function dismissLandscapeHint(page) {
    await page.evaluate(() => {
        const hint = document.getElementById('landscape-hint');
        if (hint) {
            hint.style.setProperty('display', 'none', 'important');
            hint.style.setProperty('pointer-events', 'none', 'important');
        }
    });
}

export async function waitForGameReady(page, { hideLandscapeHint: hideLandscape = false } = {}) {
    if (hideLandscape) await hideLandscapeHint(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    if (hideLandscape) await dismissLandscapeHint(page);
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
    if (!usesTouch) {
        await page.keyboard.press('Escape');
    } else {
        const { pauseButton } = TOUCH_TARGETS;
        await pointerGameCoord(page, pauseButton.x, pauseButton.y, true);
        const paused = await page.evaluate(() => window.__FLOPPY_TEST__?.getState?.());
        if (paused !== 'paused') {
            await page.evaluate(() => window.__FLOPPY_TEST__?.openPause?.());
        }
    }
    await expectGameState(page, 'paused');
}

/** @param {boolean} usesTouch */
export async function returnToMenuFromPause(page, usesTouch) {
    await expectGameState(page, 'paused');
    const { pauseMenu } = TOUCH_TARGETS;
    await pointerGameCoord(page, pauseMenu.x, pauseMenu.y, usesTouch, { force: true });
    let state = await page.evaluate(() => window.__FLOPPY_TEST__?.getState?.());
    if (state === 'menu') return;
    if (state === 'playing') {
        await page.evaluate(() => window.__FLOPPY_TEST__?.openPause?.());
        await expectGameState(page, 'paused');
    }
    await page.evaluate(() => window.__FLOPPY_TEST__?.returnToMenu?.());
    await expectGameState(page, 'menu');
}

/** @param {boolean} usesTouch */
export async function enterPausedFromPlaying(page, usesTouch) {
    await startPlayingFromMenu(page, usesTouch);
    if (usesTouch) {
        await page.waitForFunction(() => window.__FLOPPY_TEST__?.getScoreHud?.() != null, { timeout: 5_000 });
    }
    await openPauseFromPlaying(page, usesTouch);
}

export function projectUsesTouch(testInfo) {
    return testInfo.project.use.hasTouch ?? false;
}

export function isMobileLandscapeProject(projectName) {
    return projectName === 'chromium-mobile-landscape'
        || projectName === 'webkit-mobile-landscape';
}

export async function tapGameCoord(page, gameX, gameY) {
    await pointerGameCoord(page, gameX, gameY, true);
}

export async function landscapeHintCoversCanvas(page) {
    return page.evaluate(() => {
        const hint = document.getElementById('landscape-hint');
        const canvas = document.querySelector('#game-container canvas');
        if (!hint || !canvas) return false;
        const style = getComputedStyle(hint);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        const canvasRect = canvas.getBoundingClientRect();
        const x = canvasRect.left + canvasRect.width / 2;
        const y = canvasRect.top + canvasRect.height * 0.48;
        const top = document.elementFromPoint(x, y);
        return top === hint || hint.contains(top);
    });
}
