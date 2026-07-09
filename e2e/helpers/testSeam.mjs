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
export function getOptionsPanel(page) {
    return page.evaluate(() => window.__FLOPPY_TEST__?.getOptionsPanel?.() ?? null);
}

/** @param {import('@playwright/test').Page} page */
export function getGameplayEquity(page) {
    return page.evaluate(() => window.__FLOPPY_TEST__?.getGameplayEquity?.() ?? null);
}

/** @param {import('@playwright/test').Page} page */
export function requestJump(page) {
    return page.evaluate(() => window.__FLOPPY_TEST__?.requestJump?.());
}

/** @param {import('@playwright/test').Page} page @param {number} [frames] */
export function grantCoyoteGrace(page, frames) {
    return page.evaluate((n) => window.__FLOPPY_TEST__?.grantCoyoteGrace?.(n), frames);
}

/** @param {import('@playwright/test').Page} page */
export function forceGameOver(page) {
    return page.evaluate(() => window.__FLOPPY_TEST__?.forceGameOver?.());
}

/** @param {import('@playwright/test').Page} page @param {'pipe' | 'ground' | 'ceiling'} [cause] */
export function triggerDeath(page, cause = 'pipe') {
    return page.evaluate((c) => window.__FLOPPY_TEST__?.triggerDeath?.(c), cause);
}

/** @param {import('@playwright/test').Page} page */
export function getRoundScore(page) {
    return page.evaluate(() => window.__FLOPPY_TEST__?.getRoundScore?.() ?? null);
}

/** @param {import('@playwright/test').Page} page */
export function getPipeState(page) {
    return page.evaluate(() => window.__FLOPPY_TEST__?.getPipeState?.() ?? null);
}

/** @param {import('@playwright/test').Page} page */
export function advancePipeForScore(page) {
    return page.evaluate(() => window.__FLOPPY_TEST__?.advancePipeForScore?.() ?? null);
}

/** @param {import('@playwright/test').Page} page */
export function getTrainingRuntime(page) {
    return page.evaluate(() => window.__FLOPPY_TEST__?.getTrainingRuntime?.() ?? null);
}

/** @param {import('@playwright/test').Page} page */
export function waitForScoreHud(page, timeout = 5_000) {
    return page.waitForFunction(() => window.__FLOPPY_TEST__?.getScoreHud?.() != null, { timeout });
}

/** @param {import('@playwright/test').Page} page */
export function getTutorialState(page) {
    return page.evaluate(() => window.__FLOPPY_TEST__?.getTutorialState?.() ?? null);
}

/** @param {import('@playwright/test').Page} page @param {number} [count] */
export function sampleGapVariance(page, count = 32) {
    return page.evaluate((n) => window.__FLOPPY_TEST__?.sampleGapVariance?.(n), count);
}

/** @param {import('@playwright/test').Page} page */
export function cycleTrainingSpeed(page) {
    return page.evaluate(() => window.__FLOPPY_TEST__?.cycleTrainingSpeed?.() ?? null);
}

/** @param {import('@playwright/test').Page} page @param {number} [times] */
export function cycleTrainingSpeedTimes(page, times = 4) {
    return page.evaluate((n) => {
        const seam = window.__FLOPPY_TEST__;
        const out = [];
        for (let i = 0; i < n; i++) out.push(seam?.cycleTrainingSpeed?.());
        return out;
    }, times);
}
