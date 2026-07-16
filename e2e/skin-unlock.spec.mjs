import { test, expect } from '@playwright/test';
import { waitForGameReady } from './helpers/gameCoords.mjs';
import { simulateSkinUnlockAtScore } from './helpers/testSeam.mjs';

test.describe('déblocage skin', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => localStorage.clear());
    });

    test('simule un unlock et notifie un toast skin', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);

        const result = await simulateSkinUnlockAtScore(page, 10);
        expect(result).toBeTruthy();
        expect(result.after.length).toBeGreaterThan(result.before.length);
        expect(result.newly.some((n) => n.kind === 'skin')).toBe(true);
    });
});
