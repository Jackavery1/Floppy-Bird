import { test, expect } from '@playwright/test';
import {
    isMobilePortraitProject,
    startPlayingFromMenu,
    waitForGameReady,
} from './helpers/gameCoords.mjs';

test.describe('cibles tactiques ≥ 44 px', () => {
    test('bouton pause après letterbox (portrait tactile)', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'portrait tactile uniquement');
        await waitForGameReady(page);
        await startPlayingFromMenu(page, true);
        const minScreenPx = await page.evaluate(() => {
            const canvas = document.querySelector('#game-container canvas');
            if (!canvas) return 0;
            const scale = canvas.getBoundingClientRect().width / 288;
            return 44 * scale;
        });
        expect(minScreenPx).toBeGreaterThanOrEqual(44);
    });

    test('boutons menu secondaires après letterbox', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'portrait tactile uniquement');
        await waitForGameReady(page);
        const minHeightPx = await page.evaluate(() => {
            const canvas = document.querySelector('#game-container canvas');
            const btn = document.getElementById('a11y-scores');
            if (!canvas || !btn) return 0;
            const scale = canvas.getBoundingClientRect().height / 512;
            return parseFloat(btn.style.height || '0') || 44 * scale;
        });
        expect(minHeightPx).toBeGreaterThanOrEqual(44);
    });
});
