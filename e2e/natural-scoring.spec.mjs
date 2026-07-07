import { test, expect } from '@playwright/test';
import {
    projectUsesTouch,
    startPlayingFromMenu,
    waitForGameReady,
} from './helpers/gameCoords.mjs';
import {
    advancePipeForScore,
    getPipeState,
    getRoundScore,
    getScoreHud,
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
});
