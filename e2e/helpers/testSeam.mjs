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

/** @param {import('@playwright/test').Page} page @param {string} key */
export function getHudBannerText(page, key) {
    return page.evaluate((k) => window.__FLOPPY_TEST__?.getHudBannerText?.(k) ?? null, key);
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
export function forceGameOver(page, opts = {}) {
    return page.evaluate((o) => window.__FLOPPY_TEST__?.forceGameOver?.(o), opts);
}

/** @param {import('@playwright/test').Page} page */
export function getGameOverRestartLabel(page) {
    return page.evaluate(() => window.__FLOPPY_TEST__?.getGameOverRestartLabel?.() ?? null);
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
export function getLastDeathMetrics(page) {
    return page.evaluate(() => window.__FLOPPY_TEST__?.getLastDeathMetrics?.() ?? null);
}

/** @param {import('@playwright/test').Page} page */
export function getRoundRuntime(page) {
    return page.evaluate(() => window.__FLOPPY_TEST__?.getRoundRuntime?.() ?? null);
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

/** @param {import('@playwright/test').Page} page @param {number} [score] */
export function getDifficultyMetrics(page, score) {
    return page.evaluate((s) => window.__FLOPPY_TEST__?.getDifficultyMetrics?.(s), score);
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

/** @param {import('@playwright/test').Page} page @param {{ hardcore?: boolean, training?: boolean }} [modes] */
export function restartRoundWithModes(page, modes = {}) {
    return page.evaluate((m) => window.__FLOPPY_TEST__?.restartRoundWithModes?.(m), modes);
}

/** @param {import('@playwright/test').Page} page */
export function runCoyoteGapExitScenario(page) {
    return page.evaluate(() => window.__FLOPPY_TEST__?.runCoyoteGapExitScenario?.());
}

/** @param {import('@playwright/test').Page} page */
export function runCoyoteBoundsScenario(page) {
    return page.evaluate(() => window.__FLOPPY_TEST__?.runCoyoteBoundsScenario?.());
}

/** @param {import('@playwright/test').Page} page */
export function holdBirdAtCenter(page) {
    return page.evaluate(() => window.__FLOPPY_TEST__?.holdBirdAtCenter?.());
}

/** @param {import('@playwright/test').Page} page @param {number} spawnDelayMs @param {number} invincibilityMs */
export async function keepBirdAliveForPipeSpawn(page, spawnDelayMs, invincibilityMs) {
    await page.waitForTimeout(invincibilityMs - 50);
    const remaining = spawnDelayMs - (invincibilityMs - 50) + 600;
    for (let elapsed = 0; elapsed < remaining; elapsed += 180) {
        await holdBirdAtCenter(page);
        await requestJump(page);
        await page.waitForTimeout(180);
    }
}

/** @param {import('@playwright/test').Page} page */
export function alignBirdInFirstGap(page) {
    return page.evaluate(() => window.__FLOPPY_TEST__?.alignBirdInFirstGap?.() ?? null);
}

/** @param {import('@playwright/test').Page} page @param {number} [durationMs] */
export function runSurvivalScenario(page, durationMs = 30_000) {
    return page.evaluate(
        (ms) => window.__FLOPPY_TEST__?.runSurvivalScenario?.(ms) ?? null,
        durationMs
    );
}

/** @param {import('@playwright/test').Page} page */
export function tickSurvivalAssist(page) {
    return page.evaluate(() => window.__FLOPPY_TEST__?.tickSurvivalAssist?.() ?? null);
}

/** @param {import('@playwright/test').Page} page @param {number} [timeoutMs] */
export async function waitForNaturalPipeScore(page, timeoutMs = 15_000) {
    const before = (await getRoundScore(page)) ?? 0;
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        await alignBirdInFirstGap(page);
        const score = await getRoundScore(page);
        if (score != null && score > before) return score;
        await page.waitForTimeout(120);
    }
    return null;
}

/** @param {import('@playwright/test').Page} page @param {number} [deltaMs] */
export function advancePipeSpawnWait(page, deltaMs) {
    return page.evaluate((ms) => window.__FLOPPY_TEST__?.advancePipeSpawnWait?.(ms), deltaMs);
}

/** @param {import('@playwright/test').Page} page */
export function probeAudio(page) {
    return page.evaluate(() => window.__FLOPPY_TEST__?.probeAudio?.() ?? null);
}

/** @param {import('@playwright/test').Page} page @param {boolean} [freeze] */
export function freezeBackgroundAnimation(page, freeze = true) {
    return page.evaluate((value) => window.__FLOPPY_TEST__?.freezeBackgroundAnimation?.(value), freeze);
}

/** @param {import('@playwright/test').Page} page */
export function probeHaptics(page) {
    return page.evaluate(() => window.__FLOPPY_TEST__?.probeHaptics?.() ?? null);
}
