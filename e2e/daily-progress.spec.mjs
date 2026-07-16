import { test, expect } from '@playwright/test';
import { waitForGameReady } from './helpers/gameCoords.mjs';
import { isDailyCompletedToday, saveDailyCompletion } from './helpers/testSeam.mjs';

test.describe('persistance défi du jour', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => localStorage.clear());
    });

    test('le ✓ du jour survit à une rejouée sous l’objectif', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);

        const completed = await saveDailyCompletion(page, {
            goal: 5,
            score: 8,
            difficulty: 'normal',
            skinId: 'classic',
        });
        expect(completed).toBe(true);
        expect(await isDailyCompletedToday(page)).toBe(true);

        const stillDone = await saveDailyCompletion(page, {
            goal: 5,
            score: 1,
            difficulty: 'normal',
            skinId: 'classic',
        });
        expect(stillDone).toBe(true);
        expect(await isDailyCompletedToday(page)).toBe(true);
    });
});
