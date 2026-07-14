import { test, expect } from '@playwright/test';
import { GAME_CONFIG } from '../src/config.js';
import {
    isMobilePortraitProject,
    projectUsesTouch,
    startPlayingFromMenu,
    waitForGameReady,
} from './helpers/gameCoords.mjs';
import {
    advancePipeForScore,
    advancePipeSpawnWait,
    alignBirdInFirstGap,
    getPipeState,
    getRoundScore,
    getScoreHud,
    holdBirdAtCenter,
    requestJump,
    waitForNaturalPipeScore,
} from './helpers/testSeam.mjs';

test.describe('scoring naturel', () => {
    test('passe un tuyau et incrémente le score sans bumpScore', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await startPlayingFromMenu(page, usesTouch);

        await expect
            .poll(async () => getPipeState(page))
            .toMatchObject({ pipeCount: expect.any(Number) });

        const before = (await getRoundScore(page)) ?? 0;
        const after = await advancePipeForScore(page);
        expect(after).toBeGreaterThan(before);
        await expect.poll(async () => getScoreHud(page)).toMatchObject({ text: String(after) });
    });

    test('trois tuyaux via seam reflètent le HUD', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await startPlayingFromMenu(page, usesTouch);

        let score = 0;
        for (let i = 0; i < 3; i++) {
            score = (await advancePipeForScore(page)) ?? score;
        }
        expect(score).toBeGreaterThanOrEqual(3);
        await expect.poll(async () => getScoreHud(page)).toMatchObject({ text: String(score) });
    });

    test('passe un tuyau en mobile portrait', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        await waitForGameReady(page);
        await startPlayingFromMenu(page, true);

        await expect
            .poll(async () => getPipeState(page))
            .toMatchObject({ pipeCount: expect.any(Number) });

        const before = (await getRoundScore(page)) ?? 0;
        const after = await advancePipeForScore(page);
        expect(after).toBeGreaterThan(before);
        await expect.poll(async () => getScoreHud(page)).toMatchObject({ text: String(after) });
    });

    test('score naturel quand le tuyau défile (sans advancePipeForScore)', async ({
        page,
    }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await startPlayingFromMenu(page, usesTouch);
        await holdBirdAtCenter(page);
        await advancePipeSpawnWait(page, GAME_CONFIG.round.pipeSpawnDelayMs);

        await expect
            .poll(async () => (await getPipeState(page))?.pipeCount ?? 0, { timeout: 3_000 })
            .toBeGreaterThan(0);

        const before = (await getRoundScore(page)) ?? 0;
        const after = await waitForNaturalPipeScore(page);
        expect(after).not.toBeNull();
        expect(after).toBeGreaterThan(before);
        await expect.poll(async () => getScoreHud(page)).toMatchObject({ text: String(after) });
        expect(await alignBirdInFirstGap(page)).toMatchObject({ gapMidY: expect.any(Number) });
    });
});
