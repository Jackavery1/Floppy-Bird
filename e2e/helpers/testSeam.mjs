/** Façade Playwright — centralise l’accès à window.__FLOPPY_TEST__. */

/** @param {import('@playwright/test').Page} page */
export function waitForTestSeamReady(page, timeout = 20_000) {
    return page.waitForFunction(() => window.__FLOPPY_TEST__?.ready(), { timeout });
}

/** @param {import('@playwright/test').Page} page */
export function getTestState(page) {
    return page.evaluate(() => window.__FLOPPY_TEST__?.getState?.() ?? null);
}

/** @param {import('@playwright/test').Page} page */
export function getScoreHud(page) {
    return page.evaluate(() => window.__FLOPPY_TEST__?.getScoreHud?.() ?? null);
}

/** @param {import('@playwright/test').Page} page @param {number} [amount] */
export function bumpScore(page, amount = 1) {
    return page.evaluate((n) => window.__FLOPPY_TEST__?.bumpScore?.(n), amount);
}

/** @param {import('@playwright/test').Page} page */
export function getCanvasLayout(page) {
    return page.evaluate(() => window.__FLOPPY_TEST__?.getCanvasLayout?.() ?? null);
}

/** @param {import('@playwright/test').Page} page */
export function getDailyChallengeMode(page) {
    return page.evaluate(() => window.__FLOPPY_TEST__?.getDailyChallengeMode?.() ?? null);
}

/** @param {import('@playwright/test').Page} page */
export function getMenuPanels(page) {
    return page.evaluate(() => window.__FLOPPY_TEST__?.getMenuPanels?.() ?? null);
}

/** @param {import('@playwright/test').Page} page */
export function forceGameOver(page) {
    return page.evaluate(() => window.__FLOPPY_TEST__?.forceGameOver?.());
}

/** @param {import('@playwright/test').Page} page */
export function waitForScoreHud(page, timeout = 5_000) {
    return page.waitForFunction(() => window.__FLOPPY_TEST__?.getScoreHud?.() != null, { timeout });
}
