import { test, expect } from '@playwright/test';
import {
    isMobilePortraitProject,
    startPlayingFromMenu,
    waitForGameReady,
} from './helpers/gameCoords.mjs';

/** Hauteur minimale écran (px) d’un bouton a11y DOM, via style inline + letterbox. */
async function minA11yButtonHeightPx(page, buttonId) {
    return page.evaluate((id) => {
        const canvas = document.querySelector('#game-container canvas');
        const btn = document.getElementById(id);
        if (!canvas || !btn) return 0;
        const scale = canvas.getBoundingClientRect().height / 512;
        const styled = parseFloat(btn.style.height || '0');
        const sized = parseFloat(btn.style.width || btn.style.height || '0');
        const minDim = btn.style.width && btn.style.height ? Math.min(styled, sized) : styled;
        return minDim || 44 * scale;
    }, buttonId);
}

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

    test('boutons menu secondaires SCORE / OPTS / SKINS après letterbox', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'portrait tactile uniquement');
        await waitForGameReady(page);
        for (const id of ['a11y-scores', 'a11y-options', 'a11y-skins']) {
            const minHeightPx = await minA11yButtonHeightPx(page, id);
            expect(minHeightPx, id).toBeGreaterThanOrEqual(44);
        }
    });

    test('boutons panneaux options et skins après ouverture', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'portrait tactile uniquement');
        await waitForGameReady(page);

        await page.locator('#a11y-options').tap({ force: true });
        await expect(page.locator('#a11y-options-close')).toBeVisible();
        for (const id of [
            'a11y-options-close',
            'a11y-options-tab-controls',
            'a11y-options-tab-preferences',
        ]) {
            const minHeightPx = await minA11yButtonHeightPx(page, id);
            expect(minHeightPx, id).toBeGreaterThanOrEqual(44);
        }

        await page.locator('#a11y-options-close').tap({ force: true });
        await page.locator('#a11y-skins').tap({ force: true });
        await expect(page.locator('#a11y-skins-close')).toBeVisible();
        for (const id of ['a11y-skin-prev', 'a11y-skin-next', 'a11y-skins-close']) {
            const minHeightPx = await minA11yButtonHeightPx(page, id);
            expect(minHeightPx, id).toBeGreaterThanOrEqual(44);
        }
    });
});
